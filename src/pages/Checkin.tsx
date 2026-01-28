import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Target, Loader2, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import { QuickCheckin } from '@/components/checkin/QuickCheckin';
import { DailyProgress } from '@/components/dashboard/DailyProgress';
import { Button } from '@/components/ui/button';
import { getTodayDate, updateDailyStats, formatDate } from '@/lib/supabase-helpers';

interface Goal {
  id: string;
  title: string;
  daily_target_minutes: number;
  todayMinutes: number;
}

export default function Checkin() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const today = getTodayDate();

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    if (!user) return;

    try {
      // Fetch active goals
      const { data: goalsData, error: goalsError } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('title');

      if (goalsError) throw goalsError;

      // Fetch today's check-ins
      const { data: checkinsData } = await supabase
        .from('checkins')
        .select('goal_id, minutes_studied')
        .eq('user_id', user.id)
        .eq('checkin_date', today);

      // Map check-ins to goals
      const checkinMap = new Map<string, number>();
      checkinsData?.forEach((c) => {
        const current = checkinMap.get(c.goal_id) || 0;
        checkinMap.set(c.goal_id, current + c.minutes_studied);
      });

      const goalsWithProgress = (goalsData || []).map((goal) => ({
        id: goal.id,
        title: goal.title,
        daily_target_minutes: goal.daily_target_minutes,
        todayMinutes: checkinMap.get(goal.id) || 0,
      }));

      setGoals(goalsWithProgress);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMinutes = async (goalId: string, minutes: number) => {
    if (!user) return;

    // Check if a check-in exists for today
    const { data: existing } = await supabase
      .from('checkins')
      .select('id, minutes_studied')
      .eq('goal_id', goalId)
      .eq('checkin_date', today)
      .maybeSingle();

    if (existing) {
      // Update existing check-in
      await supabase
        .from('checkins')
        .update({ minutes_studied: existing.minutes_studied + minutes })
        .eq('id', existing.id);
    } else {
      // Create new check-in
      await supabase.from('checkins').insert({
        user_id: user.id,
        goal_id: goalId,
        checkin_date: today,
        minutes_studied: minutes,
      });
    }

    // Update daily stats
    await updateDailyStats(user.id, today);

    // Update local state
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId ? { ...g, todayMinutes: g.todayMinutes + minutes } : g
      )
    );
  };

  const totalMinutes = goals.reduce((sum, g) => sum + g.todayMinutes, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.daily_target_minutes, 0);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (goals.length === 0) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
            <Target className="h-10 w-10 text-primary" />
          </div>
          <h2 className="mt-6 text-xl font-bold text-foreground">No active goals</h2>
          <p className="mt-2 max-w-sm text-muted-foreground">
            Create a goal to start logging your study time.
          </p>
          <Button asChild className="mt-6">
            <Link to="/goals/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Goal
            </Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Check In</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(today)}</span>
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground text-center">
            Today's Total
          </h2>
          <DailyProgress currentMinutes={totalMinutes} targetMinutes={totalTarget} />
        </div>

        {/* Goals Check-in */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Log Study Time</h2>
          {goals.map((goal) => (
            <QuickCheckin
              key={goal.id}
              goalId={goal.id}
              goalTitle={goal.title}
              currentMinutes={goal.todayMinutes}
              targetMinutes={goal.daily_target_minutes}
              onAddMinutes={handleAddMinutes}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
