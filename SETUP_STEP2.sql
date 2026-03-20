-- STEP 2: Set service role key
-- Run this after Step 1 succeeds

ALTER DATABASE postgres SET app.service_role_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptdHBvamp4a2JnbG50Z2d1eHZmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzQxMTkxNSwiZXhwIjoyMDg4OTg3OTE1fQ.FHK_AxYuVD7kTjxcd8y-To-YXVn5wHBztcsZAA9UqZo';

SELECT pg_reload_conf();