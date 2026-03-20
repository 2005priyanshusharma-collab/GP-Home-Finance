// User types
export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  created_at: string;
}

// Loan Application types
export interface LoanApplication {
  id: string;
  user_id: string;
  loan_type: LoanType;
  loan_amount: number;
  tenure_months: number;
  purpose: string;
  employment_type: EmploymentType;
  monthly_income: number;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  property_address?: string;
  property_value?: number;
}

export type LoanType =
  | 'home_loan'
  | 'mortgage_loan'
  | 'Personal_loan'
  | 'top-up_loan'
  | 'balance_transfer'
  | 'loan_against_property';

export type EmploymentType =
  | 'salaried'
  | 'self_employed'
  | 'business_owner'
  | 'professional';

export type ApplicationStatus =
  | 'pending'
  | 'under_review'
  | 'documents_required'
  | 'approved'
  | 'rejected'
  | 'disbursed';

// EMI Calculator types
export interface EMICalculation {
  principal: number;
  interestRate: number;
  tenure: number;
  emi: number;
  totalInterest: number;
  totalAmount: number;
}

// Contact form types
export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

// Bank types for display
export interface Bank {
  id: string;
  name: string;
  logo_url?: string;
  interest_rate_min: number;
  interest_rate_max: number;
  processing_fee: number;
  max_tenure_years: number;
}

// Service types
export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
}

// Dashboard stats
export interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  totalLoanAmount: number;
}