-- STEP 3: Update loan types constraint
-- Run this after Step 2 succeeds

ALTER TABLE loan_applications DROP CONSTRAINT IF EXISTS loan_applications_loan_type_check;
ALTER TABLE loan_applications ADD CONSTRAINT loan_applications_loan_type_check
  CHECK (loan_type IN (
    'home_purchase', 'home_construction', 'home_improvement', 'land_purchase',
    'balance_transfer', 'loan_against_property', 'home_loan', 'mortgage_loan',
    'Personal_loan', 'top-up_loan', 'Commercial_loan'
  ));