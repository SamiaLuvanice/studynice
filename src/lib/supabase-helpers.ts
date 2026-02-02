import { supabase } from "@/integrations/supabase/client";

// Helper to get today's date in YYYY-MM-DD format using browser timezone
export function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper to format date for display with locale support
export function formatDate(date: string, locale: string = 'en'): string {
  const localeCode = locale === 'pt-BR' ? 'pt-BR' : 'en-US';
  return new Date(date + 'T00:00:00').toLocaleDateString(localeCode, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

// Helper to get the last N days as date strings using browser timezone
export function getLastNDays(n: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
  }
  
  return dates;
}

// Calculate streak from daily stats
export async function calculateStreak(userId: string): Promise<{
  currentStreak: number;
  bestStreak: number;
  totalMinutes: number;
  totalDaysCompleted: number;
}> {
  const { data: dailyStats, error } = await supabase
    .from('daily_stats')
    .select('*')
    .eq('user_id', userId)
    .order('stat_date', { ascending: false });

  if (error || !dailyStats) {
    return { currentStreak: 0, bestStreak: 0, totalMinutes: 0, totalDaysCompleted: 0 };
  }

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  let totalMinutes = 0;
  let totalDaysCompleted = 0;

  const today = getTodayDate();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Calculate streaks
  for (let i = 0; i < dailyStats.length; i++) {
    const stat = dailyStats[i];
    totalMinutes += stat.total_minutes;
    
    if (stat.is_completed) {
      totalDaysCompleted++;
      tempStreak++;
      
      // Current streak calculation
      if (i === 0 && (stat.stat_date === today || stat.stat_date === yesterdayStr)) {
        currentStreak = tempStreak;
      } else if (i > 0) {
        const prevDate = new Date(dailyStats[i - 1].stat_date);
        const currDate = new Date(stat.stat_date);
        const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          if (dailyStats[0].stat_date === today || dailyStats[0].stat_date === yesterdayStr) {
            currentStreak = tempStreak;
          }
        } else {
          tempStreak = 1;
        }
      }
      
      bestStreak = Math.max(bestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  return { currentStreak, bestStreak, totalMinutes, totalDaysCompleted };
}

// Update daily stats after a check-in
export async function updateDailyStats(userId: string, date: string): Promise<void> {
  // Get all active goals for the user
  const { data: goals } = await supabase
    .from('goals')
    .select('id, daily_target_minutes')
    .eq('user_id', userId)
    .eq('is_active', true);

  if (!goals || goals.length === 0) return;

  // Get all check-ins for this date
  const { data: checkins } = await supabase
    .from('checkins')
    .select('minutes_studied')
    .eq('user_id', userId)
    .eq('checkin_date', date);

  const totalMinutes = checkins?.reduce((sum, c) => sum + c.minutes_studied, 0) || 0;
  const targetMinutes = goals.reduce((sum, g) => sum + g.daily_target_minutes, 0);
  const isCompleted = totalMinutes >= targetMinutes;

  // Upsert daily stats
  await supabase
    .from('daily_stats')
    .upsert({
      user_id: userId,
      stat_date: date,
      total_minutes: totalMinutes,
      target_minutes: targetMinutes,
      is_completed: isCompleted,
    }, {
      onConflict: 'user_id,stat_date',
    });

  // Recalculate and update user stats
  const streakData = await calculateStreak(userId);
  
  await supabase
    .from('user_stats')
    .upsert({
      user_id: userId,
      current_streak: streakData.currentStreak,
      best_streak: streakData.bestStreak,
      total_minutes: streakData.totalMinutes,
      total_days_completed: streakData.totalDaysCompleted,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id',
    });
}
