-- STEP 5: Create triggers
-- Run this after Step 4 succeeds

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

-- Verify triggers
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_name IN ('on_new_loan_application', 'on_new_contact_submission');