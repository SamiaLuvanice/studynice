-- Create a function to call n8n webhook when a new user signs up
CREATE OR REPLACE FUNCTION notify_n8n_new_user()
RETURNS TRIGGER AS $$
DECLARE
  webhook_url TEXT;
  payload JSON;
  user_email TEXT;
BEGIN
  -- Get the webhook URL from config (if exists and active)
  SELECT wc.webhook_url INTO webhook_url
  FROM webhook_configs wc
  WHERE wc.webhook_name = 'welcome_email_notification' 
    AND wc.is_active = true
  LIMIT 1;

  -- Only proceed if webhook is configured
  IF webhook_url IS NOT NULL THEN
    -- Get user email from auth.users
    SELECT email INTO user_email
    FROM auth.users
    WHERE id = NEW.id;

    -- Build the payload
    payload := json_build_object(
      'event_type', 'user_created',
      'user', json_build_object(
        'id', NEW.id,
        'full_name', COALESCE(NEW.full_name, 'Novo Usuário'),
        'email', user_email,
        'timezone', NEW.timezone,
        'created_at', NEW.created_at
      ),
      'timestamp', NOW()
    );

    -- Call the webhook using pg_net
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

-- Create trigger for new profiles (fires after user creation)
DROP TRIGGER IF EXISTS trigger_notify_n8n_new_user ON profiles;
CREATE TRIGGER trigger_notify_n8n_new_user
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION notify_n8n_new_user();

-- Insert a placeholder webhook config for welcome emails
INSERT INTO webhook_configs (webhook_name, webhook_url, is_active)
VALUES ('welcome_email_notification', 'https://your-n8n-instance.com/webhook/welcome', false)
ON CONFLICT (webhook_name) DO NOTHING;
