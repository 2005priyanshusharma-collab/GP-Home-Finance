-- COMPLETE EMAIL NOTIFICATION SETUP
-- Copy and paste this ENTIRE script into Supabase SQL Editor and run it once

-- STEP 1: Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_net" CASCADE;

-- STEP 2: Create config table for storing service role key
CREATE TABLE IF NOT EXISTS app_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Insert service role key
INSERT INTO app_config (key, value)
VALUES ('service_role_key', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptdHBvamp4a2JnbG50Z2d1eHZmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzQxMTkxNSwiZXhwIjoyMDg4OTg3OTE1fQ.FHK_AxYuVD7kTjxcd8y-To-YXVn5wHBztcsZAA9UqZo')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- STEP 3: Drop old loan type constraint (ignore if it doesn't exist)
ALTER TABLE loan_applications DROP CONSTRAINT IF EXISTS loan_applications_loan_type_check;

-- STEP 4: Create notification function for loan applications
CREATE OR REPLACE FUNCTION notify_new_loan_application()
RETURNS TRIGGER AS $$
DECLARE
  request_id bigint;
  supabase_url text := 'https://jmtpojjxkbglntgguxvf.supabase.co/functions/v1/send-notification';
  service_key text;
BEGIN
  SELECT value INTO service_key FROM app_config WHERE key = 'service_role_key';
  IF service_key IS NULL THEN
    RAISE NOTICE 'Service role key not configured.';
    RETURN NEW;
  END IF;

  SELECT net.http_post(
    url := supabase_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_key
    ),
    body := jsonb_build_object(
      'type', 'loan_application',
      'data', jsonb_build_object(
        'id', NEW.id,
        'applicant_name', NEW.applicant_name,
        'applicant_email', NEW.applicant_email,
        'applicant_phone', NEW.applicant_phone,
        'loan_type', NEW.loan_type,
        'loan_amount', NEW.loan_amount,
        'tenure_months', NEW.tenure_months,
        'purpose', NEW.purpose,
        'employment_type', NEW.employment_type,
        'monthly_income', NEW.monthly_income,
        'property_address', NEW.property_address,
        'property_value', NEW.property_value
      )
    )
  ) INTO request_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 5: Create notification function for contact submissions
CREATE OR REPLACE FUNCTION notify_new_contact_submission()
RETURNS TRIGGER AS $$
DECLARE
  request_id bigint;
  supabase_url text := 'https://jmtpojjxkbglntgguxvf.supabase.co/functions/v1/send-notification';
  service_key text;
BEGIN
  SELECT value INTO service_key FROM app_config WHERE key = 'service_role_key';
  IF service_key IS NULL THEN
    RAISE NOTICE 'Service role key not configured.';
    RETURN NEW;
  END IF;

  SELECT net.http_post(
    url := supabase_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_key
    ),
    body := jsonb_build_object(
      'type', 'contact_submission',
      'data', jsonb_build_object(
        'id', NEW.id,
        'name', NEW.name,
        'email', NEW.email,
        'phone', NEW.phone,
        'subject', NEW.subject,
        'message', NEW.message
      )
    )
  ) INTO request_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 6: Create triggers
DROP TRIGGER IF EXISTS on_new_loan_application ON loan_applications;
CREATE TRIGGER on_new_loan_application
  AFTER INSERT ON loan_applications
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_loan_application();

DROP TRIGGER IF EXISTS on_new_contact_submission ON contact_submissions;
CREATE TRIGGER on_new_contact_submission
  AFTER INSERT ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_contact_submission();

-- STEP 7: Verify everything is set up
SELECT 'Triggers created:' as status;
SELECT trigger_name, event_object_table as table_name
FROM information_schema.triggers
WHERE trigger_name IN ('on_new_loan_application', 'on_new_contact_submission');

SELECT 'Config table:' as status;
SELECT * FROM app_config;

SELECT 'Setup complete! Emails will be sent to gphomefinance@gmail.com' as message;