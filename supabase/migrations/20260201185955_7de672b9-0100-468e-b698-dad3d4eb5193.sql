-- Add timezone column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'America/Sao_Paulo';

-- Create function to recalculate daily_stats for a specific date
CREATE OR REPLACE FUNCTION public.recalculate_daily_stats(
  p_user_id uuid,
  p_date date
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_minutes integer;
  v_target_minutes integer;
  v_is_completed boolean;
BEGIN
  -- Calculate total minutes from checkins for the date
  SELECT COALESCE(SUM(c.minutes_studied), 0)
  INTO v_total_minutes
  FROM checkins c
  WHERE c.user_id = p_user_id 
    AND c.checkin_date = p_date;

  -- Calculate target minutes from active goals
  SELECT COALESCE(SUM(g.daily_target_minutes), 0)
  INTO v_target_minutes
  FROM goals g
  WHERE g.user_id = p_user_id 
    AND g.is_active = true;

  -- Determine if completed
  v_is_completed := v_total_minutes >= v_target_minutes AND v_target_minutes > 0;

  -- Upsert daily_stats
  INSERT INTO daily_stats (user_id, stat_date, total_minutes, target_minutes, is_completed)
  VALUES (p_user_id, p_date, v_total_minutes, v_target_minutes, v_is_completed)
  ON CONFLICT (user_id, stat_date) 
  DO UPDATE SET 
    total_minutes = EXCLUDED.total_minutes,
    target_minutes = EXCLUDED.target_minutes,
    is_completed = EXCLUDED.is_completed;
END;
$$;

-- Add unique constraint to daily_stats for upsert
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'daily_stats_user_date_unique'
  ) THEN
    ALTER TABLE public.daily_stats 
    ADD CONSTRAINT daily_stats_user_date_unique UNIQUE (user_id, stat_date);
  END IF;
END $$;

-- Create function to recalculate user_stats (streaks and totals)
CREATE OR REPLACE FUNCTION public.recalculate_user_stats(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_minutes integer;
  v_total_days_completed integer;
  v_current_streak integer := 0;
  v_best_streak integer := 0;
  v_temp_streak integer := 0;
  v_prev_date date := NULL;
  rec RECORD;
BEGIN
  -- Calculate totals
  SELECT 
    COALESCE(SUM(total_minutes), 0),
    COALESCE(COUNT(*) FILTER (WHERE is_completed = true), 0)
  INTO v_total_minutes, v_total_days_completed
  FROM daily_stats
  WHERE user_id = p_user_id;

  -- Calculate streaks by iterating through completed days
  FOR rec IN 
    SELECT stat_date 
    FROM daily_stats 
    WHERE user_id = p_user_id AND is_completed = true
    ORDER BY stat_date DESC
  LOOP
    IF v_prev_date IS NULL THEN
      -- First completed day - check if it's today or yesterday for current streak
      IF rec.stat_date >= CURRENT_DATE - INTERVAL '1 day' THEN
        v_temp_streak := 1;
        v_current_streak := 1;
      ELSE
        v_temp_streak := 1;
        v_current_streak := 0;
      END IF;
    ELSIF v_prev_date - rec.stat_date = 1 THEN
      -- Consecutive day
      v_temp_streak := v_temp_streak + 1;
      IF v_current_streak > 0 THEN
        v_current_streak := v_temp_streak;
      END IF;
    ELSE
      -- Gap found - check if this is best streak
      IF v_temp_streak > v_best_streak THEN
        v_best_streak := v_temp_streak;
      END IF;
      v_temp_streak := 1;
    END IF;
    v_prev_date := rec.stat_date;
  END LOOP;

  -- Final check for best streak
  IF v_temp_streak > v_best_streak THEN
    v_best_streak := v_temp_streak;
  END IF;

  -- Update user_stats
  INSERT INTO user_stats (user_id, total_minutes, total_days_completed, current_streak, best_streak, updated_at)
  VALUES (p_user_id, v_total_minutes, v_total_days_completed, v_current_streak, v_best_streak, now())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    total_minutes = EXCLUDED.total_minutes,
    total_days_completed = EXCLUDED.total_days_completed,
    current_streak = EXCLUDED.current_streak,
    best_streak = EXCLUDED.best_streak,
    updated_at = now();
END;
$$;

-- Create function to get monthly calendar data
CREATE OR REPLACE FUNCTION public.get_monthly_calendar_data(
  p_user_id uuid,
  p_year integer,
  p_month integer
)
RETURNS TABLE (
  stat_date date,
  total_minutes integer,
  target_minutes integer,
  is_completed boolean,
  goals_count integer
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_start_date date;
  v_end_date date;
BEGIN
  v_start_date := make_date(p_year, p_month, 1);
  v_end_date := (v_start_date + INTERVAL '1 month - 1 day')::date;

  RETURN QUERY
  SELECT 
    ds.stat_date,
    ds.total_minutes,
    ds.target_minutes,
    ds.is_completed,
    (SELECT COUNT(DISTINCT c.goal_id)::integer 
     FROM checkins c 
     WHERE c.user_id = p_user_id 
       AND c.checkin_date = ds.stat_date 
       AND c.minutes_studied > 0) as goals_count
  FROM daily_stats ds
  WHERE ds.user_id = p_user_id
    AND ds.stat_date >= v_start_date
    AND ds.stat_date <= v_end_date;
END;
$$;