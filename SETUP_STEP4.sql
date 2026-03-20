-- STEP 4: Create notification functions
-- Run this after Step 3 succeeds

CREATE OR REPLACE FUNCTION notify_new_loan_application()
RETURNS TRIGGER AS $$
DECLARE
  request_id bigint;
  supabase_url text := 'https://jmtpojjxkbglntgguxvf.supabase.co/functions/v1/send-notification';
  service_key text;
BEGIN
  service_key := current_setting('app.service_role_key', true);

  IF service_key IS NULL OR service_key = '' THEN
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

CREATE OR REPLACE FUNCTION notify_new_contact_submission()
RETURNS TRIGGER AS $$
DECLARE
  request_id bigint;
  supabase_url text := 'https://jmtpojjxkbglntgguxvf.supabase.co/functions/v1/send-notification';
  service_key text;
BEGIN
  service_key := current_setting('app.service_role_key', true);

  IF service_key IS NULL OR service_key = '' THEN
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