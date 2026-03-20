# GP Home Finance

A professional home loan and finance web application built with React, TypeScript, and Supabase.

## Features

- **User Authentication**: Secure login/signup with Supabase Auth
- **Loan Application**: Multi-step loan application form
- **EMI Calculator**: Interactive EMI calculator with amortization schedule
- **Dashboard**: Track loan applications and status
- **Contact Form**: Inquiry and support system
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Routing**: React Router v6
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier available)
- A Vercel account (for deployment)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd GP-Home-Finance
npm install
```

### 2. Set Up Supabase

1. Go to [Supabase](https://supabase.com) and create a free account
2. Create a new project
3. Go to Project Settings > API and copy:
   - Project URL
   - anon/public key

4. Run the database schema:
   - Go to SQL Editor in your Supabase dashboard
   - Copy the contents of `supabase-schema.sql`
   - Execute the SQL to create all tables and policies

5. Create `.env` file:
```bash
cp .env.example .env
```

6. Update `.env` with your Supabase credentials:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

## Deployment to Vercel

### Option 1: Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. For production deployment:
```bash
vercel --prod
```

### Option 2: Vercel Dashboard

1. Go to [Vercel](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your repository or upload the project folder
4. Configure environment variables:
   - Add `VITE_SUPABASE_URL`
   - Add `VITE_SUPABASE_ANON_KEY`
5. Deploy

## Project Structure

```
GP-Home-Finance/
├── src/
│   ├── components/
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── Layout.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── lib/
│   │   └── supabase.ts
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── LoanApplicationPage.tsx
│   │   ├── EMICalculatorPage.tsx
│   │   └── ContactPage.tsx
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── supabase-schema.sql
├── .env.example
└── package.json
```

## Features Overview

### Landing Page
- Professional hero section
- Services showcase (6 loan types)
- Statistics and partner banks
- Call-to-action sections

### Authentication
- Email/password signup with validation
- Secure login with password visibility toggle
- Protected routes for authenticated users

### Dashboard
- Application overview with statistics
- Application status tracking
- Quick access to new applications

### Loan Application
- 4-step wizard interface
- Multiple loan types support
- Form validation at each step
- Employment and income details collection

### EMI Calculator
- Interactive sliders for loan parameters
- Real-time EMI calculation
- Amortization schedule (yearly breakdown)
- Quick preset buttons

### Contact Form
- Multiple contact channels
- Form submission to Supabase
- Subject categorization

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

## License

This project is for demonstration purposes.

## Support

For any issues or questions, please contact us at info@gphomefinance.com