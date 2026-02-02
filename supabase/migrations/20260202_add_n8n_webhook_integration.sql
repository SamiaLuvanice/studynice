-- Create a table to store webhook configurations
CREATE TABLE IF NOT EXISTS webhook_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_name TEXT NOT NULL UNIQUE,
  webhook_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS for webhook_configs (admin only)
ALTER TABLE webhook_configs ENABLE ROW LEVEL SECURITY;

-- Create policy for webhook_configs (you might want to adjust this based on your admin setup)
CREATE POLICY "Only service role can manage webhooks"
  ON webhook_configs FOR ALL
  USING (false); -- This prevents all users; only service_role can access

-- Create a function to call n8n webhook when a new goal is created
CREATE OR REPLACE FUNCTION notify_n8n_new_goal()
RETURNS TRIGGER AS $$
DECLARE
  webhook_url TEXT;
  payload JSON;
  user_profile RECORD;
BEGIN
  -- Get the webhook URL from config (if exists and active)
  SELECT wc.webhook_url INTO webhook_url
  FROM webhook_configs wc
  WHERE wc.webhook_name = 'new_goal_notification' 
    AND wc.is_active = true
  LIMIT 1;

  -- Only proceed if webhook is configured
  IF webhook_url IS NOT NULL THEN
    -- Get user profile and email information
    SELECT p.full_name, p.timezone, u.email INTO user_profile
    FROM profiles p
    INNER JOIN auth.users u ON u.id = p.id
    WHERE p.id = NEW.user_id;

    -- Build the payload
    payload := json_build_object(
      'event_type', 'goal_created',
      'goal', json_build_object(
        'id', NEW.id,
        'title', NEW.title,
        'category', NEW.category,
        'daily_target_minutes', NEW.daily_target_minutes,
        'created_at', NEW.created_at
      ),
      'user', json_build_object(
        'id', NEW.user_id,
        'full_name', COALESCE(user_profile.full_name, 'User'),
        'email', user_profile.email,
        'timezone', COALESCE(user_profile.timezone, 'UTC')
      ),
      'timestamp', NOW()
    );

    -- Call the webhook using pg_net (Supabase's HTTP client)
    -- Note: This requires the pg_net extension to be enabled
    PERFORM
      net.http_post(
        url := webhook_url,
        headers := '{"Content-Type": "application/json"}'::jsonb,
        body := payload::jsonb
      );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new goals
DROP TRIGGER IF EXISTS trigger_notify_n8n_new_goal ON goals;
CREATE TRIGGER trigger_notify_n8n_new_goal
  AFTER INSERT ON goals
  FOR EACH ROW
  EXECUTE FUNCTION notify_n8n_new_goal();

-- Insert a placeholder webhook config (to be updated with real n8n URL)
INSERT INTO webhook_configs (webhook_name, webhook_url, is_active)
VALUES ('new_goal_notification', 'https://your-n8n-instance.com/webhook/new-goal', false)
ON CONFLICT (webhook_name) DO NOTHING;

-- Create a function to update webhook URL (can be called from your app)
CREATE OR REPLACE FUNCTION update_webhook_config(
  p_webhook_name TEXT,
  p_webhook_url TEXT,
  p_is_active BOOLEAN DEFAULT true
)
RETURNS void AS $$
BEGIN
  INSERT INTO webhook_configs (webhook_name, webhook_url, is_active)
  VALUES (p_webhook_name, p_webhook_url, p_is_active)
  ON CONFLICT (webhook_name) 
  DO UPDATE SET 
    webhook_url = EXCLUDED.webhook_url,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
