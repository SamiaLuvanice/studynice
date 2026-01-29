import { useEffect, useState } from 'react';
import { User, Mail, Trophy, Clock, Target, Flame, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/ui/stat-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StreakBadge } from '@/components/dashboard/StreakBadge';
import { toast } from 'sonner';

interface ProfileData {
  fullName: string;
  avatarUrl: string;
}

interface Stats {
  currentStreak: number;
  bestStreak: number;
  totalMinutes: number;
  totalDaysCompleted: number;
  totalGoals: number;
}

export default function Profile() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({ fullName: '', avatarUrl: '' });
  const [stats, setStats] = useState<Stats>({
    currentStreak: 0,
    bestStreak: 0,
    totalMinutes: 0,
    totalDaysCompleted: 0,
    totalGoals: 0,
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      const [profileRes, statsRes, goalsRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle(),
        supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('goals')
          .select('id')
          .eq('user_id', user.id),
      ]);

      if (profileRes.data) {
        setProfile({
          fullName: profileRes.data.full_name || '',
          avatarUrl: profileRes.data.avatar_url || '',
        });
      }

      setStats({
        currentStreak: statsRes.data?.current_streak || 0,
        bestStreak: statsRes.data?.best_streak || 0,
        totalMinutes: statsRes.data?.total_minutes || 0,
        totalDaysCompleted: statsRes.data?.total_days_completed || 0,
        totalGoals: goalsRes.data?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.fullName,
          avatar_url: profile.avatarUrl,
        })
        .eq('id', user.id);

      if (error) throw error;
      toast.success(t('profile.updated'));
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(t('common.error'));
    } finally {
      setSaving(false);
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

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('profile.title')}</h1>
            <p className="text-muted-foreground">{t('profile.stats')}</p>
          </div>
          <StreakBadge streak={stats.currentStreak} size="lg" />
        </div>

        {/* Profile Info */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">{t('profile.title')}</h2>
          
          <div className="space-y-2">
            <Label htmlFor="email">{t('profile.email')}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
                className="pl-10 bg-muted"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">{t('profile.fullName')}</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="fullName"
                placeholder={t('profile.fullNamePlaceholder')}
                className="pl-10"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              />
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : t('profile.save')}
          </Button>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">{t('profile.stats')}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              title={t('dashboard.currentStreak')}
              value={`${stats.currentStreak} ${stats.currentStreak === 1 ? t('dashboard.day') : t('dashboard.days')}`}
              icon={<Flame className="h-5 w-5" />}
              variant="streak"
            />
            <StatCard
              title={t('dashboard.bestStreak')}
              value={`${stats.bestStreak} ${stats.bestStreak === 1 ? t('dashboard.day') : t('dashboard.days')}`}
              icon={<Trophy className="h-5 w-5" />}
              variant="primary"
            />
            <StatCard
              title={t('dashboard.totalMinutes')}
              value={formatTime(stats.totalMinutes)}
              icon={<Clock className="h-5 w-5" />}
            />
            <StatCard
              title={t('dashboard.daysCompleted')}
              value={stats.totalDaysCompleted}
              icon={<Target className="h-5 w-5" />}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
