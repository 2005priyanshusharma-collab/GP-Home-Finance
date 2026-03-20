-- GP Home Finance - Final Email Notification Setup
-- Run this ENTIRE script in Supabase SQL Editor
-- Go to: Supabase Dashboard > SQL Editor > New Query

-- ============================================================
-- STEP 1: Enable required extensions
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_net" CASCADE;

-- ============================================================
-- STEP 2: Set service role key (REQUIRED for triggers to work)
-- This allows triggers to call the Edge Function
-- ============================================================
ALTER DATABASE postgres SET app.service_role_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptdHBvamp4a2JnbG50Z2d1eHZmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzQxMTkxNSwiZXhwIjoyMDg4OTg3OTE1fQ.FHK_AxYuVD7kTjxcd8y-To-YXVn5wHBztcsZAA9UqZo';

-- Reload the configuration
SELECT pg_reload_conf();

-- ============================================================
-- STEP 3: Update loan_applications constraint for all loan types
-- ============================================================
ALTER TABLE loan_applications DROP CONSTRAINT IF EXISTS loan_applications_loan_type_check;
ALTER TABLE loan_applications ADD CONSTRAINT loan_applications_loan_type_check
  CHECK (loan_type IN (
    'home_purchase', 'home_construction', 'home_improvement', 'land_purchase',
    'balance_transfer', 'loan_against_property', 'home_loan', 'mortgage_loan',
    'Personal_loan', 'top-up_loan', 'Commercial_loan'
  ));

-- ============================================================
-- STEP 4: Create function for loan application notifications
-- ============================================================
CREATE OR REPLACE FUNCTION notify_new_loan_application()
RETURNS TRIGGER AS $$
DECLARE
  request_id bigint;
  supabase_url text := 'https://jmtpojjxkbglntgguxvf.supabase.co/functions/v1/send-notification';
  service_key text;
BEGIN
  service_key := current_setting('app.service_role_key', true);

  IF service_key IS NULL OR service_key = '' THEN
    RAISE NOTICE 'Service role key not configured. Email notification skipped.';
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

-- ============================================================
-- STEP 5: Create function for contact form notifications
-- ============================================================
CREATE OR REPLACE FUNCTION notify_new_contact_submission()
RETURNS TRIGGER AS $$
DECLARE
  request_id bigint;
  supabase_url text := 'https://jmtpojjxkbglntgguxvf.supabase.co/functions/v1/send-notification';
  service_key text;
BEGIN
  service_key := current_setting('app.service_role_key', true);

  IF service_key IS NULL OR service_key = '' THEN
    RAISE NOTICE 'Service role key not configured. Email notification skipped.';
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

-- ============================================================
-- STEP 6: Create triggers (drop existing ones first)
-- ============================================================
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

-- ============================================================
-- STEP 7: Verify triggers are created
-- ============================================================
SELECT
  trigger_name,
  event_manipulation as event,
  event_object_table as table_name,
  action_statement
FROM information_schema.triggers
WHERE trigger_name IN ('on_new_loan_application', 'on_new_contact_submission');

-- ============================================================
-- DONE! Your email notification system is now active.
-- Test by submitting a loan application or contact form.
-- Emails will be sent to: gphomefinance@gmail.com
-- ============================================================