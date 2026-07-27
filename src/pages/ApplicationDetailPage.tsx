import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { LoanApplication, ApplicationStatus } from '../types';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  User,
  Briefcase,
  MapPin,
  Building2
} from 'lucide-react';

const statusColors: Record<ApplicationStatus, { bg: string; text: string; border: string; icon: typeof Clock }> = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock },
  under_review: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: AlertCircle },
  documents_required: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: FileText },
  approved: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: CheckCircle },
  rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: XCircle },
  disbursed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle },
};

const statusLabels: Record<ApplicationStatus, string> = {
  pending: 'Pending',
  under_review: 'Under Review',
  documents_required: 'Documents Required',
  approved: 'Approved',
  rejected: 'Rejected',
  disbursed: 'Disbursed',
};

const loanTypeLabels: Record<string, string> = {
  home_purchase: 'Home Purchase',
  home_construction: 'Home Construction',
  home_improvement: 'Home Improvement',
  land_purchase: 'Land Purchase',
  balance_transfer: 'Balance Transfer',
  loan_against_property: 'Loan Against Property',
  home_loan: 'Home Loan',
  mortgage_loan: 'Mortgage Loan',
  Personal_loan: 'Personal Loan',
  'top-up_loan': 'Top-up Loan',
  Commercial_loan: 'Commercial Loan'
};

const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [application, setApplication] = useState<LoanApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplicationDetails = useCallback(async () => {
    if (!user || !id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('loan_applications')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setApplication(data);
    } catch (err) {
      console.error('Error fetching application details:', err);
      setError('Failed to retrieve application details. It may not exist or you do not have permission to view it.');
    } finally {
      setLoading(false);
    }
  }, [user, id]);

  useEffect(() => {
    fetchApplicationDetails();
  }, [fetchApplicationDetails]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-surface-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-lg border border-neutral-200">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-light text-primary-600 mb-2">Error Loading Application</h2>
          <p className="text-neutral-500 text-sm mb-6">{error || 'Application not found.'}</p>
          <Link to="/dashboard" className="btn-primary inline-flex items-center text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const StatusIcon = statusColors[application.status]?.icon || Clock;
  const currentStatus = application.status;

  // Determine timeline step states
  const getStepState = (step: number) => {
    // Steps: 1: Submitted, 2: Under Review, 3: Decision (Approved/Rejected), 4: Disbursed
    if (currentStatus === 'rejected' && step === 3) return 'rejected';

    switch (step) {
      case 1: // Submitted is always completed
        return 'completed';
      case 2:
        return ['under_review', 'documents_required', 'approved', 'disbursed', 'rejected'].includes(currentStatus)
          ? 'completed'
          : 'pending';
      case 3:
        return ['approved', 'disbursed'].includes(currentStatus)
          ? 'completed'
          : 'pending';
      case 4:
        return currentStatus === 'disbursed'
          ? 'completed'
          : 'pending';
      default:
        return 'pending';
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6 animate-fade-in">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center text-sm text-neutral-500 hover:text-primary-600 transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
        </div>

        {/* Main Card Header */}
        <div className="bg-white rounded-t-lg border-x border-t border-neutral-200 p-6 md:p-8 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="font-mono text-xs text-neutral-400 bg-neutral-100 py-1 px-2.5 rounded">
                  ID: {application.id.toUpperCase()}
                </span>
                <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border ${statusColors[currentStatus]?.bg} ${statusColors[currentStatus]?.text} ${statusColors[currentStatus]?.border}`}>
                  <StatusIcon className="w-3 h-3 mr-1.5" />
                  {statusLabels[currentStatus]}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-light text-primary-600 tracking-tight">
                {loanTypeLabels[application.loan_type] || application.loan_type} Application
              </h1>
              <p className="text-neutral-500 text-xs mt-1.5 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                Submitted on {formatDate(application.created_at)}
              </p>
            </div>
            <div className="md:text-right">
              <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Requested Amount</p>
              <p className="text-3xl font-light text-primary-600 mt-1 tracking-tight">
                {formatCurrency(application.loan_amount)}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline Progress */}
        <div className="bg-white border-x border-neutral-200 border-t border-b p-6 md:p-8 animate-fade-in animate-stagger-1">
          <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-6">Application Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Horizontal Line for MD+ screens */}
            <div className="hidden md:block absolute top-5 left-[12%] right-[12%] h-0.5 bg-neutral-200 z-0"></div>

            {/* Step 1: Submitted */}
            <div className="flex md:flex-col items-center md:text-center gap-3 md:gap-2 z-10">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100 border-2 border-green-500 text-green-600 font-medium">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm text-neutral-800">Submitted</p>
                <p className="text-xs text-neutral-500">Form successfully received</p>
              </div>
            </div>

            {/* Step 2: Under Review */}
            <div className="flex md:flex-col items-center md:text-center gap-3 md:gap-2 z-10">
              {getStepState(2) === 'completed' ? (
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100 border-2 border-green-500 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-50 border-2 border-blue-400 text-blue-500 animate-pulse">
                  <Clock className="w-5 h-5" />
                </div>
              )}
              <div>
                <p className="font-semibold text-sm text-neutral-800">Under Review</p>
                <p className="text-xs text-neutral-500">Checking eligibility & docs</p>
              </div>
            </div>

            {/* Step 3: Decision */}
            <div className="flex md:flex-col items-center md:text-center gap-3 md:gap-2 z-10">
              {getStepState(3) === 'completed' ? (
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100 border-2 border-green-500 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
              ) : getStepState(3) === 'rejected' ? (
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100 border-2 border-red-500 text-red-600">
                  <XCircle className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-neutral-50 border-2 border-neutral-300 text-neutral-400">
                  <Clock className="w-5 h-5" />
                </div>
              )}
              <div>
                <p className="font-semibold text-sm text-neutral-800">
                  {currentStatus === 'rejected' ? 'Rejected' : 'Approval'}
                </p>
                <p className="text-xs text-neutral-500">Credit team decision</p>
              </div>
            </div>

            {/* Step 4: Disbursed */}
            <div className="flex md:flex-col items-center md:text-center gap-3 md:gap-2 z-10">
              {getStepState(4) === 'completed' ? (
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-100 border-2 border-emerald-500 text-emerald-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-neutral-50 border-2 border-neutral-300 text-neutral-400">
                  <Clock className="w-5 h-5" />
                </div>
              )}
              <div>
                <p className="font-semibold text-sm text-neutral-800">Disbursement</p>
                <p className="text-xs text-neutral-500">Funds transferred to account</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Grids */}
        <div className="grid md:grid-cols-2 gap-6 mt-6 animate-fade-in animate-stagger-2">
          {/* Card 1: Applicant Details */}
          <div className="card">
            <h3 className="text-base font-semibold text-primary-600 border-b border-neutral-100 pb-3 mb-4 flex items-center">
              <User className="w-4 h-4 mr-2 text-accent-500" />
              Applicant Personal Info
            </h3>
            <div className="space-y-3.5 text-sm">
              <div>
                <p className="text-xs text-neutral-400">Full Name</p>
                <p className="font-medium text-neutral-800 mt-0.5">{application.applicant_name}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">Email Address</p>
                <p className="font-medium text-neutral-800 mt-0.5">{application.applicant_email}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">Phone Number</p>
                <p className="font-medium text-neutral-800 mt-0.5">{application.applicant_phone}</p>
              </div>
            </div>
          </div>

          {/* Card 2: Employment & Income Details */}
          <div className="card">
            <h3 className="text-base font-semibold text-primary-600 border-b border-neutral-100 pb-3 mb-4 flex items-center">
              <Briefcase className="w-4 h-4 mr-2 text-accent-500" />
              Employment & Income
            </h3>
            <div className="space-y-3.5 text-sm">
              <div>
                <p className="text-xs text-neutral-400">Employment Type</p>
                <p className="font-medium text-neutral-800 mt-0.5 capitalize">{application.employment_type.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">Monthly Net Income</p>
                <p className="font-medium text-neutral-800 mt-0.5">{formatCurrency(application.monthly_income)}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">Annual Income Estimate</p>
                <p className="font-medium text-neutral-800 mt-0.5">{formatCurrency(application.monthly_income * 12)}</p>
              </div>
            </div>
          </div>

          {/* Card 3: Loan Details */}
          <div className="card">
            <h3 className="text-base font-semibold text-primary-600 border-b border-neutral-100 pb-3 mb-4 flex items-center">
              <Building2 className="w-4 h-4 mr-2 text-accent-500" />
              Loan Specifications
            </h3>
            <div className="space-y-3.5 text-sm">
              <div>
                <p className="text-xs text-neutral-400">Requested Amount</p>
                <p className="font-medium text-neutral-800 mt-0.5">{formatCurrency(application.loan_amount)}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">Preferred Tenure</p>
                <p className="font-medium text-neutral-800 mt-0.5">{application.tenure_months} Months ({Math.round(application.tenure_months / 12)} Years)</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">Purpose of Loan</p>
                <p className="font-medium text-neutral-800 mt-0.5 leading-relaxed">{application.purpose}</p>
              </div>
            </div>
          </div>

          {/* Card 4: Property Details */}
          <div className="card">
            <h3 className="text-base font-semibold text-primary-600 border-b border-neutral-100 pb-3 mb-4 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-accent-500" />
              Property Particulars
            </h3>
            {application.property_address || application.property_value ? (
              <div className="space-y-3.5 text-sm">
                {application.property_address && (
                  <div>
                    <p className="text-xs text-neutral-400">Property Address</p>
                    <p className="font-medium text-neutral-800 mt-0.5 leading-relaxed">{application.property_address}</p>
                  </div>
                )}
                {application.property_value && (
                  <div>
                    <p className="text-xs text-neutral-400">Estimated Property Value</p>
                    <p className="font-medium text-neutral-800 mt-0.5">{formatCurrency(application.property_value)}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-neutral-400 text-sm">
                No property details were submitted with this application.
              </div>
            )}
          </div>
        </div>

        {/* Footer help notice */}
        <div className="mt-8 text-center text-xs text-neutral-400 bg-white border border-neutral-200 rounded-lg p-5 leading-relaxed animate-fade-in">
          <p>Need to submit additional documents or make changes to this application?</p>
          <p className="mt-1">
            Please get in touch with our customer support at{' '}
            <a href="mailto:support@gphomefinance.com" className="text-accent-600 hover:underline">
              support@gphomefinance.com
            </a>{' '}
            referencing your Application ID.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailPage;
