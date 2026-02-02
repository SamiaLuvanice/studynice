import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Target, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { GoalCard } from '@/components/goals/GoalCard';
import { Button } from '@/components/ui/button';
import { getTodayDate } from '@/lib/supabase-helpers';
import { toast } from 'sonner';

interface Goal {
  id: string;
  title: string;
  daily_target_minutes: number;
  category: string | null;
  is_active: boolean;
  todayMinutes?: number;
}

export default function Goals() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    if (!user) return;

    try {
      const today = getTodayDate();

      // Fetch goals
      const { data: goalsData, error: goalsError } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

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
        ...goal,
        todayMinutes: checkinMap.get(goal.id) || 0,
      }));

      setGoals(goalsWithProgress);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      const { error } = await supabase.from('goals').delete().eq('id', id);
      if (error) throw error;
      setGoals(goals.filter((g) => g.id !== id));
      toast.success(t('goals.deleted'));
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error(t('common.error'));
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
            <h1 className="text-2xl font-bold text-foreground">{t('goals.title')}</h1>
            <p className="text-muted-foreground">
              {goals.length !== 1 
                ? t('goals.subtitle').replace('{count}', String(goals.length))
                : t('goals.subtitleSingular').replace('{count}', String(goals.length))
              }
            </p>
          </div>
          <Button asChild>
            <Link to="/goals/new">
              <Plus className="mr-2 h-4 w-4" />
              {t('goals.create')}
            </Link>
          </Button>
        </div>

        {/* Goals List */}
        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
              <Target className="h-10 w-10 text-primary" />
            </div>
            <h2 className="mt-6 text-xl font-bold text-foreground">{t('goals.noGoals')}</h2>
            <p className="mt-2 max-w-sm text-muted-foreground">
              {t('goals.noGoalsDesc')}
            </p>
            <Button asChild className="mt-6">
              <Link to="/goals/new">
                <Plus className="mr-2 h-4 w-4" />
                {t('goals.create')}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                id={goal.id}
                title={goal.title}
                dailyTargetMinutes={goal.daily_target_minutes}
                category={goal.category}
                isActive={goal.is_active}
                todayMinutes={goal.todayMinutes}
                onDelete={handleDeleteGoal}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
