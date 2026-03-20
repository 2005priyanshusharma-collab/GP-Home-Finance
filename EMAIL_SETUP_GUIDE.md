# Email Notification Setup Guide

This guide will help you complete the email notification setup for GP Home Finance. When users submit loan applications or contact forms, emails will be automatically sent to `gphomefinance@gmail.com`.

## Prerequisites

1. A [Resend](https://resend.com) account (free tier available)
2. Access to your Supabase dashboard

---

## Step 1: Get Your Resend API Key

1. Go to [resend.com](https://resend.com) and sign up/login
2. Navigate to **API Keys** in the dashboard
3. Click **Create API Key**
4. Give it a name like "GP Home Finance"
5. Copy the API key (starts with `re_`)

---

## Step 2: Add Resend API Key to Supabase

1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `GP-Home-Finance`
3. Go to **Edge Functions** in the left sidebar
4. Click on **Settings** (gear icon) or **Manage secrets**
5. Add a new secret:
   - **Name:** `RESEND_API_KEY`
   - **Value:** Your Resend API key (e.g., `re_xxxxxxxxxx`)
6. Click **Save**

---

## Step 3: Deploy the Edge Function

If the edge function is not already deployed:

### Using Supabase CLI:
```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref jmtpojjxkbglntgguxvf

# Deploy the function
supabase functions deploy send-notification
```

### Or Deploy Manually:
1. Go to **Edge Functions** in Supabase Dashboard
2. Click **Create Function**
3. Name it `send-notification`
4. Copy the content from `supabase/functions/send-notification/index.ts`
5. Click **Deploy**

---

## Step 4: Get Your Service Role Key

1. In Supabase Dashboard, go to **Settings** > **API**
2. Under **Project API keys**, find **service_role** key
3. Copy this key (keep it secret!)

---

## Step 5: Configure Database Triggers

1. In Supabase Dashboard, go to **SQL Editor**
2. Open the file `supabase/functions/send-notification/triggers.sql`
3. **IMPORTANT:** First, set your service role key:

```sql
-- Replace YOUR_ACTUAL_SERVICE_ROLE_KEY with your service role key
ALTER DATABASE postgres SET app.service_role_key = 'YOUR_ACTUAL_SERVICE_ROLE_KEY_HERE';

-- Reload the configuration
SELECT pg_reload_conf();
```

4. Then run the rest of the SQL from `triggers.sql`

---

## Step 6: Verify Your Domain in Resend (For Production)

1. Go to [Resend Dashboard](https://resend.com/domains)
2. Add your domain (e.g., `gphomefinance.com`)
3. Add the DNS records shown to your domain
4. Wait for verification

**Note:** For testing, you can send emails to your own email address without domain verification.

---

## Step 7: Test the Setup

### Test Loan Application:
1. Go to your webapp
2. Login and submit a loan application
3. Check `gphomefinance@gmail.com` for the notification email

### Test Contact Form:
1. Go to the Contact page
2. Submit a contact form
3. Check `gphomefinance@gmail.com` for the notification email

---

## Troubleshooting

### Emails not being sent?

1. **Check Edge Function logs:**
   - Go to Supabase Dashboard > Edge Functions > send-notification
   - Click **Logs** to see any errors

2. **Verify Resend API key:**
   - Make sure it starts with `re_`
   - Check it's correctly saved in Supabase secrets

3. **Check database triggers:**
   ```sql
   SELECT trigger_name, event_object_table
   FROM information_schema.triggers
   WHERE trigger_name LIKE '%notify%';
   ```

4. **Test edge function directly:**
   ```bash
   curl -X POST 'https://jmtpojjxkbglntgguxvf.supabase.co/functions/v1/send-notification' \
     -H 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' \
     -H 'Content-Type: application/json' \
     -d '{
       "type": "contact_submission",
       "data": {
         "id": "test-123",
         "name": "Test User",
         "email": "test@example.com",
         "phone": "+91 9876543210",
         "subject": "Test",
         "message": "This is a test message"
       }
     }'
   ```

---

## Email Templates

The system sends two types of emails:

1. **Loan Application Email** - Blue themed, includes:
   - Applicant details (name, email, phone)
   - Loan details (type, amount, tenure, purpose)
   - Employment details
   - Property information (if applicable)

2. **Contact Form Email** - Green themed, includes:
   - Contact details (name, email, phone)
   - Subject and message

Both emails are formatted professionally and sent from `noreply@gphomefinance.com` (update this after domain verification).

---

## Quick Setup Commands

If you have Supabase CLI installed:

```bash
# Navigate to project
cd "C:/Users/Priyanshu sharma/GP-Home-Finance"

# Login and link
supabase login
supabase link --project-ref jmtpojjxkbglntgguxvf

# Set secrets
supabase secrets set RESEND_API_KEY=re_your_api_key_here

# Deploy function
supabase functions deploy send-notification
```