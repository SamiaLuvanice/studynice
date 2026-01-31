import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Target, Clock, Trophy, Flame, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/ui/stat-card';
import { DailyProgress } from '@/components/dashboard/DailyProgress';
import { StreakBadge } from '@/components/dashboard/StreakBadge';
import { WeeklyChart } from '@/components/charts/WeeklyChart';
import { Button } from '@/components/ui/button';
import { getTodayDate, getLastNDays } from '@/lib/supabase-helpers';
interface DashboardData {
  todayMinutes: number;
  todayTarget: number;
  currentStreak: number;
  bestStreak: number;
  totalMinutes: number;
  totalDaysCompleted: number;
  weeklyData: Array<{
    date: string;
    minutes: number;
    target: number;
  }>;
  hasGoals: boolean;
}
export default function Dashboard() {
  const {
    user
  } = useAuth();
  const {
    t
  } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    todayMinutes: 0,
    todayTarget: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalMinutes: 0,
    totalDaysCompleted: 0,
    weeklyData: [],
    hasGoals: false
  });
  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);
  const fetchDashboardData = async () => {
    if (!user) return;
    try {
      const today = getTodayDate();
      const last7Days = getLastNDays(7);

      // Fetch all data in parallel
      const [goalsRes, todayCheckinsRes, userStatsRes, weeklyStatsRes] = await Promise.all([supabase.from('goals').select('id, daily_target_minutes').eq('user_id', user.id).eq('is_active', true), supabase.from('checkins').select('minutes_studied').eq('user_id', user.id).eq('checkin_date', today), supabase.from('user_stats').select('*').eq('user_id', user.id).maybeSingle(), supabase.from('daily_stats').select('*').eq('user_id', user.id).gte('stat_date', last7Days[0]).order('stat_date', {
        ascending: true
      })]);
      const goals = goalsRes.data || [];
      const todayTarget = goals.reduce((sum, g) => sum + g.daily_target_minutes, 0);
      const todayMinutes = todayCheckinsRes.data?.reduce((sum, c) => sum + c.minutes_studied, 0) || 0;
      const userStats = userStatsRes.data;

      // Build weekly data
      const weeklyMap = new Map((weeklyStatsRes.data || []).map(s => [s.stat_date, s]));
      const weeklyData = last7Days.map(date => {
        const stat = weeklyMap.get(date);
        return {
          date,
          minutes: stat?.total_minutes || 0,
          target: stat?.target_minutes || todayTarget
        };
      });
      setData({
        todayMinutes,
        todayTarget,
        currentStreak: userStats?.current_streak || 0,
        bestStreak: userStats?.best_streak || 0,
        totalMinutes: userStats?.total_minutes || 0,
        totalDaysCompleted: userStats?.total_days_completed || 0,
        weeklyData,
        hasGoals: goals.length > 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <AppLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>;
  }

  // Empty state
  if (!data.hasGoals) {
    return <AppLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
            <Target className="h-10 w-10 text-primary" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-foreground">{t('dashboard.noGoals')}</h2>
          <p className="mt-2 max-w-sm text-muted-foreground">
            {t('dashboard.createGoal')}
          </p>
          <Button asChild className="mt-6">
            <Link to="/goals/new">
              <Plus className="mr-2 h-4 w-4" />
              {t('goals.create')}
            </Link>
          </Button>
        </div>
      </AppLayout>;
  }
  return <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('dashboard.title')}</h1>
            <p className="text-muted-foreground">{t('dashboard.todayProgress')}</p>
          </div>
          <StreakBadge streak={data.currentStreak} size="lg" />
        </div>

        {/* Today's Progress */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">{t('dashboard.todayProgress')}</h2>
            <DailyProgress currentMinutes={data.todayMinutes} targetMinutes={data.todayTarget} />
            <div className="mt-4 flex justify-center">
              <Button asChild>
                <Link to="/checkin">
                  <Plus className="mr-2 h-4 w-4" />
                  {t('checkin.logTime')}
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard title={t('dashboard.currentStreak')} value={`${data.currentStreak} ${data.currentStreak === 1 ? t('dashboard.day') : t('dashboard.days')}`} icon={<Flame className="h-5 w-5" />} variant="streak" />
            <StatCard title={t('dashboard.bestStreak')} value={`${data.bestStreak} ${data.bestStreak === 1 ? t('dashboard.day') : t('dashboard.days')}`} icon={<Trophy className="h-5 w-5" />} variant="primary" />
            <StatCard title={t('dashboard.totalMinutes')} value={data.totalMinutes.toLocaleString()} icon={<Clock className="h-5 w-5" />} />
            <StatCard title={t('dashboard.daysCompleted')} value={data.totalDaysCompleted} icon={<Target className="h-5 w-5" />} />
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">{t('dashboard.weeklyOverview')}</h2>
          <WeeklyChart data={data.weeklyData} />
        </div>
      </div>
    </AppLayout>;
}