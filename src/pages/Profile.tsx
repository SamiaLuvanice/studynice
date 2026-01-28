import { useEffect, useState } from 'react';
import { User, Mail, Trophy, Clock, Target, Flame, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
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
      toast.success('Profile updated!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
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
            <h1 className="text-2xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground">Manage your account</p>
          </div>
          <StreakBadge streak={stats.currentStreak} size="lg" />
        </div>

        {/* Profile Info */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Your Information</h2>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
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
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="fullName"
                placeholder="Your name"
                className="pl-10"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              />
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
          </Button>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Your Stats</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              title="Current Streak"
              value={`${stats.currentStreak} days`}
              icon={<Flame className="h-5 w-5" />}
              variant="streak"
            />
            <StatCard
              title="Best Streak"
              value={`${stats.bestStreak} days`}
              icon={<Trophy className="h-5 w-5" />}
              variant="primary"
            />
            <StatCard
              title="Total Study Time"
              value={formatTime(stats.totalMinutes)}
              icon={<Clock className="h-5 w-5" />}
            />
            <StatCard
              title="Days Completed"
              value={stats.totalDaysCompleted}
              icon={<Target className="h-5 w-5" />}
            />
          </div>
        </div>

        {/* Account Info */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Account</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Total goals created: {stats.totalGoals}</p>
            <p>Member since: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
