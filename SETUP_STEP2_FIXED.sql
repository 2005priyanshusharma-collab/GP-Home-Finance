-- STEP 2 (FIXED): Create config table for secrets
-- Run this after Step 1 succeeds

-- Create a table to store app configuration
CREATE TABLE IF NOT EXISTS app_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Insert the service role key
INSERT INTO app_config (key, value)
VALUES ('service_role_key', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptdHBvamp4a2JnbG50Z2d1eHZmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzQxMTkxNSwiZXhwIjoyMDg4OTg3OTE1fQ.FHK_AxYuVD7kTjxcd8y-To-YXVn5wHBztcsZAA9UqZo')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;