-- Create function to recalculate daily_stats for a specific date
CREATE OR REPLACE FUNCTION public.recalculate_daily_stats(
  p_user_id uuid DEFAULT auth.uid(),
  p_date date DEFAULT CURRENT_DATE
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
  INSERT INTO daily_stats (user_id, stat_date, total_minutes, target_minutes, is_completed, created_at)
  VALUES (p_user_id, p_date, v_total_minutes, v_target_minutes, v_is_completed, NOW())
  ON CONFLICT (user_id, stat_date) 
  DO UPDATE SET 
    total_minutes = EXCLUDED.total_minutes,
    target_minutes = EXCLUDED.target_minutes,
    is_completed = EXCLUDED.is_completed;
END;
$$;

-- Create function to recalculate user_stats (streaks and totals)
CREATE OR REPLACE FUNCTION public.recalculate_user_stats(p_user_id uuid DEFAULT auth.uid())
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
      -- First completed day
      IF rec.stat_date >= CURRENT_DATE - INTERVAL '1 day' THEN
        v_current_streak := 1;
      ELSE
        v_current_streak := 0;
      END IF;
      v_temp_streak := 1;
    ELSIF v_prev_date - rec.stat_date = 1 THEN
      -- Consecutive day
      v_temp_streak := v_temp_streak + 1;
      IF rec.stat_date >= CURRENT_DATE - INTERVAL '1 day' THEN
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
  VALUES (p_user_id, v_total_minutes, v_total_days_completed, v_current_streak, v_best_streak, NOW())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    total_minutes = EXCLUDED.total_minutes,
    total_days_completed = EXCLUDED.total_days_completed,
    current_streak = EXCLUDED.current_streak,
    best_streak = EXCLUDED.best_streak,
    updated_at = NOW();
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.recalculate_daily_stats TO authenticated;
GRANT EXECUTE ON FUNCTION public.recalculate_user_stats TO authenticated;
