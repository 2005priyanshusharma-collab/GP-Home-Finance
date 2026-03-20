import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const ADMIN_EMAIL = 'gphomefinance@gmail.com'

interface LoanApplication {
  id: string
  applicant_name: string
  applicant_email: string
  applicant_phone: string
  loan_type: string
  loan_amount: number
  tenure_months: number
  purpose: string
  employment_type: string
  monthly_income: number
  property_address?: string
  property_value?: number
}

interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

const getLoanTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    'home_purchase': 'Home Purchase',
    'home_construction': 'Home Construction',
    'home_improvement': 'Home Improvement',
    'land_purchase': 'Land Purchase',
    'balance_transfer': 'Balance Transfer',
    'loan_against_property': 'Loan Against Property',
    'home_loan': 'Home Loan',
    'mortgage_loan': 'Mortgage Loan',
    'Personal_loan': 'Personal Loan',
    'top-up_loan': 'Top-up Loan',
    'Commercial_loan': 'Commercial Loan'
  }
  return labels[type] || type
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount)
}

async function sendLoanApplicationEmail(application: LoanApplication) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .field { margin-bottom: 15px; }
        .label { font-weight: 600; color: #6b7280; font-size: 14px; }
        .value { font-size: 16px; color: #111827; }
        .highlight { background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏠 New Loan Application</h1>
          <p>A new loan application has been submitted</p>
        </div>
        <div class="content">
          <div class="highlight">
            <h2 style="margin: 0;">Applicant Details</h2>
          </div>
          <div class="field">
            <div class="label">Name</div>
            <div class="value">${application.applicant_name}</div>
          </div>
          <div class="field">
            <div class="label">Email</div>
            <div class="value"><a href="mailto:${application.applicant_email}">${application.applicant_email}</a></div>
          </div>
          <div class="field">
            <div class="label">Phone</div>
            <div class="value"><a href="tel:${application.applicant_phone}">${application.applicant_phone}</a></div>
          </div>

          <div class="highlight">
            <h2 style="margin: 0;">Loan Details</h2>
          </div>
          <div class="field">
            <div class="label">Loan Type</div>
            <div class="value">${getLoanTypeLabel(application.loan_type)}</div>
          </div>
          <div class="field">
            <div class="label">Loan Amount</div>
            <div class="value" style="font-size: 20px; color: #2563eb; font-weight: bold;">${formatCurrency(application.loan_amount)}</div>
          </div>
          <div class="field">
            <div class="label">Tenure</div>
            <div class="value">${application.tenure_months} months (${Math.round(application.tenure_months / 12)} years)</div>
          </div>
          <div class="field">
            <div class="label">Purpose</div>
            <div class="value">${application.purpose}</div>
          </div>
          ${application.property_address ? `
          <div class="field">
            <div class="label">Property Address</div>
            <div class="value">${application.property_address}</div>
          </div>
          ` : ''}
          ${application.property_value ? `
          <div class="field">
            <div class="label">Property Value</div>
            <div class="value">${formatCurrency(application.property_value)}</div>
          </div>
          ` : ''}

          <div class="highlight">
            <h2 style="margin: 0;">Employment Details</h2>
          </div>
          <div class="field">
            <div class="label">Employment Type</div>
            <div class="value">${application.employment_type.charAt(0).toUpperCase() + application.employment_type.slice(1)}</div>
          </div>
          <div class="field">
            <div class="label">Monthly Income</div>
            <div class="value">${formatCurrency(application.monthly_income)}</div>
          </div>

          <div style="margin-top: 30px; padding: 20px; background: #fef3c7; border-radius: 8px; text-align: center;">
            <p style="margin: 0;"><strong>Application ID:</strong> ${application.id}</p>
            <p style="margin: 5px 0 0 0;"><strong>Submitted:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} GP Home Finance. All rights reserved.</p>
          <p>This is an automated notification from GP Home Finance.</p>
        </div>
      </div>
    </body>
    </html>
  `

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'GP Home Finance <noreply@gphomefinance.com>',
      to: ADMIN_EMAIL,
      subject: `🏠 New Loan Application from ${application.applicant_name}`,
      html,
    }),
  })

  return res
}

async function sendContactFormEmail(contact: ContactSubmission) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .field { margin-bottom: 15px; }
        .label { font-weight: 600; color: #6b7280; font-size: 14px; }
        .value { font-size: 16px; color: #111827; }
        .message-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #059669; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📧 New Contact Form Submission</h1>
          <p>Someone has reached out via the contact form</p>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Name</div>
            <div class="value">${contact.name}</div>
          </div>
          <div class="field">
            <div class="label">Email</div>
            <div class="value"><a href="mailto:${contact.email}">${contact.email}</a></div>
          </div>
          <div class="field">
            <div class="label">Phone</div>
            <div class="value"><a href="tel:${contact.phone}">${contact.phone}</a></div>
          </div>
          <div class="field">
            <div class="label">Subject</div>
            <div class="value">${contact.subject}</div>
          </div>

          <div class="message-box">
            <div class="label">Message</div>
            <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${contact.message}</p>
          </div>

          <div style="margin-top: 30px; padding: 20px; background: #fef3c7; border-radius: 8px; text-align: center;">
            <p style="margin: 0;"><strong>Submission ID:</strong> ${contact.id}</p>
            <p style="margin: 5px 0 0 0;"><strong>Submitted:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} GP Home Finance. All rights reserved.</p>
          <p>This is an automated notification from GP Home Finance.</p>
        </div>
      </div>
    </body>
    </html>
  `

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'GP Home Finance <noreply@gphomefinance.com>',
      to: ADMIN_EMAIL,
      subject: `📧 Contact: ${contact.subject} - ${contact.name}`,
      html,
    }),
  })

  return res
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, data } = await req.json()

    let response

    if (type === 'loan_application') {
      response = await sendLoanApplicationEmail(data)
    } else if (type === 'contact_submission') {
      response = await sendContactFormEmail(data)
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid notification type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!response.ok) {
      const error = await response.text()
      console.error('Resend API error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})