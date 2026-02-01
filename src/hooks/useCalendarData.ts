import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export interface DayStats {
  stat_date: string;
  total_minutes: number;
  target_minutes: number;
  is_completed: boolean;
  goals_count: number;
}

export interface CheckinWithGoal {
  id: string;
  goal_id: string;
  goal_title: string;
  minutes_studied: number;
  checkin_date: string;
}

export function useMonthlyCalendarData(year: number, month: number) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['calendar', user?.id, year, month],
    queryFn: async () => {
      if (!user) return [];

      // Fetch daily_stats for the month
      const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('daily_stats')
        .select('stat_date, total_minutes, target_minutes, is_completed')
        .eq('user_id', user.id)
        .gte('stat_date', startDate)
        .lte('stat_date', endDate);

      if (error) throw error;

      // Also get goals count per day from checkins
      const { data: checkinsData, error: checkinsError } = await supabase
        .from('checkins')
        .select('checkin_date, goal_id')
        .eq('user_id', user.id)
        .gte('checkin_date', startDate)
        .lte('checkin_date', endDate)
        .gt('minutes_studied', 0);

      if (checkinsError) throw checkinsError;

      // Count unique goals per day
      const goalsPerDay: Record<string, Set<string>> = {};
      checkinsData?.forEach(c => {
        if (!goalsPerDay[c.checkin_date]) {
          goalsPerDay[c.checkin_date] = new Set();
        }
        goalsPerDay[c.checkin_date].add(c.goal_id);
      });

      return (data || []).map(d => ({
        ...d,
        goals_count: goalsPerDay[d.stat_date]?.size || 0,
      })) as DayStats[];
    },
    enabled: !!user,
  });
}

export function useDayCheckins(date: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['day-checkins', user?.id, date],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('checkins')
        .select(`
          id,
          goal_id,
          minutes_studied,
          checkin_date,
          goals!inner(title)
        `)
        .eq('user_id', user.id)
        .eq('checkin_date', date);

      if (error) throw error;

      return (data || []).map(c => ({
        id: c.id,
        goal_id: c.goal_id,
        goal_title: (c.goals as any)?.title || '',
        minutes_studied: c.minutes_studied,
        checkin_date: c.checkin_date,
      })) as CheckinWithGoal[];
    },
    enabled: !!user && !!date,
  });
}

export function useActiveGoals() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['active-goals', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('goals')
        .select('id, title, daily_target_minutes')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('title');

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

export function useUpsertCheckin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      goalId, 
      date, 
      minutes 
    }: { 
      goalId: string; 
      date: string; 
      minutes: number;
    }) => {
      if (!user) throw new Error('Not authenticated');

      // Check if checkin exists
      const { data: existing } = await supabase
        .from('checkins')
        .select('id, minutes_studied')
        .eq('user_id', user.id)
        .eq('goal_id', goalId)
        .eq('checkin_date', date)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('checkins')
          .update({ minutes_studied: existing.minutes_studied + minutes })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('checkins')
          .insert({
            user_id: user.id,
            goal_id: goalId,
            checkin_date: date,
            minutes_studied: minutes,
          });
        if (error) throw error;
      }

      // Recalculate daily_stats
      await supabase.rpc('recalculate_daily_stats', {
        p_user_id: user.id,
        p_date: date,
      });

      // Recalculate user_stats
      await supabase.rpc('recalculate_user_stats', {
        p_user_id: user.id,
      });

      return { date };
    },
    onSuccess: ({ date }) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
      queryClient.invalidateQueries({ queryKey: ['day-checkins'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      queryClient.invalidateQueries({ queryKey: ['daily-stats'] });
      
      toast({
        title: t('checkin.success'),
      });
    },
    onError: () => {
      toast({
        title: t('checkin.addFailed'),
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateCheckin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      checkinId, 
      minutes,
      date,
    }: { 
      checkinId: string; 
      minutes: number;
      date: string;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('checkins')
        .update({ minutes_studied: minutes })
        .eq('id', checkinId);

      if (error) throw error;

      // Recalculate daily_stats
      await supabase.rpc('recalculate_daily_stats', {
        p_user_id: user.id,
        p_date: date,
      });

      // Recalculate user_stats
      await supabase.rpc('recalculate_user_stats', {
        p_user_id: user.id,
      });

      return { date };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
      queryClient.invalidateQueries({ queryKey: ['day-checkins'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      queryClient.invalidateQueries({ queryKey: ['daily-stats'] });
      
      toast({
        title: t('checkin.success'),
      });
    },
    onError: () => {
      toast({
        title: t('checkin.addFailed'),
        variant: 'destructive',
      });
    },
  });
}
