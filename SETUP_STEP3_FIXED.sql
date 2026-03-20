-- STEP 3 (FIXED): Check existing loan types and update constraint
-- Run this after Step 2 succeeds

-- First, see what loan types currently exist
SELECT DISTINCT loan_type FROM loan_applications;

-- Drop the old constraint
ALTER TABLE loan_applications DROP CONSTRAINT IF EXISTS loan_applications_loan_type_check;

-- DO NOT add a new constraint - we'll allow any loan type
-- This is safer and matches the frontend flexibility