import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { LoanType, EmploymentType } from '../types';
import {
  Home,
  Building2,
  Wrench,
  MapPin,
  RefreshCw,
  Landmark,
  AlertCircle,
  CheckCircle,
  IndianRupee,
  User,
  Briefcase,
  FileText
} from 'lucide-react';

const loanTypes: { value: LoanType; label: string; icon: typeof Home; description: string }[] = [
  { value: 'home_loan', label: 'Home Loan', icon: Home, description: 'Buy your dream home' },
  { value: 'mortgage_loan', label: 'Mortgage Loan', icon: Building2, description: 'Unlock your dream home' },
  { value: 'Personal_loan', label: 'Personal Loan', icon: Wrench, description: 'Quick solutions for your financial needs' },
  { value: 'top-up_loan', label: 'Top-up Loan', icon: MapPin, description: 'Top Up Your Dreams, Instantly' },
  { value: 'balance_transfer', label: 'Balance Transfer', icon: RefreshCw, description: 'Transfer existing loan' },
  { value: 'Commercial_loan', label: 'Commercial Loan', icon: Landmark, description: 'Grow your business, confidently' },
];

const employmentTypes: { value: EmploymentType; label: string }[] = [
  { value: 'salaried', label: 'Salaried' },
  { value: 'self_employed', label: 'Self-Employed' },
  { value: 'business_owner', label: 'Business Owner' },
  { value: 'professional', label: 'Professional (Doctor, CA, etc.)' },
];

const LoanApplicationPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    loan_type: '' as LoanType | '',
    loan_amount: '',
    tenure_months: '',
    purpose: '',
    employment_type: '' as EmploymentType | '',
    monthly_income: '',
    applicant_name: user?.user_metadata?.full_name || '',
    applicant_email: user?.email || '',
    applicant_phone: '',
    property_address: '',
    property_value: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep = (currentStep: number): boolean => {
    setError(null);

    switch (currentStep) {
      case 1:
        if (!formData.loan_type) {
          setError('Please select a loan type');
          return false;
        }
        return true;

      case 2:
        if (!formData.loan_amount || parseInt(formData.loan_amount) < 100000) {
          setError('Loan amount must be at least Rs 1 Lakh');
          return false;
        }
        if (!formData.tenure_months || parseInt(formData.tenure_months) < 12) {
          setError('Tenure must be at least 12 months');
          return false;
        }
        if (!formData.purpose) {
          setError('Please provide the purpose of the loan');
          return false;
        }
        return true;

      case 3:
        if (!formData.employment_type) {
          setError('Please select your employment type');
          return false;
        }
        if (!formData.monthly_income || parseInt(formData.monthly_income) < 10000) {
          setError('Monthly income must be at least Rs 10,000');
          return false;
        }
        return true;

      case 4:
        if (!formData.applicant_name.trim()) {
          setError('Please enter your full name');
          return false;
        }
        if (!formData.applicant_phone || formData.applicant_phone.length < 10) {
          setError('Please enter a valid phone number');
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(step)) return;

    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const applicationData = {
        user_id: user.id,
        loan_type: formData.loan_type,
        loan_amount: parseInt(formData.loan_amount),
        tenure_months: parseInt(formData.tenure_months),
        purpose: formData.purpose,
        employment_type: formData.employment_type,
        monthly_income: parseInt(formData.monthly_income),
        applicant_name: formData.applicant_name,
        applicant_email: formData.applicant_email,
        applicant_phone: formData.applicant_phone,
        property_address: formData.property_address || null,
        property_value: formData.property_value ? parseInt(formData.property_value) : null,
        status: 'pending' as const,
      };

      const { error: insertError } = await supabase
        .from('loan_applications')
        .insert([applicationData]);

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      console.error('Error submitting application:', err);
      setError('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-4">
            Your loan application has been submitted successfully. Our team will review it and contact you within 24-48 hours.
          </p>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step > s ? <CheckCircle className="w-6 h-6" /> : s}
                </div>
                {s < 4 && (
                  <div
                    className={`w-12 md:w-24 h-1 ${
                      step > s ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className={step >= 1 ? 'text-primary-600 font-medium' : 'text-gray-400'}>Loan Type</span>
            <span className={step >= 2 ? 'text-primary-600 font-medium' : 'text-gray-400'}>Loan Details</span>
            <span className={step >= 3 ? 'text-primary-600 font-medium' : 'text-gray-400'}>Employment</span>
            <span className={step >= 4 ? 'text-primary-600 font-medium' : 'text-gray-400'}>Personal</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Step 1: Loan Type */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Loan Type</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {loanTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, loan_type: type.value }))}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          formData.loan_type === type.value
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-primary-300'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${
                            formData.loan_type === type.value
                              ? 'bg-primary-100'
                              : 'bg-gray-100'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              formData.loan_type === type.value
                                ? 'text-primary-600'
                                : 'text-gray-600'
                            }`} />
                          </div>
                          <div>
                            <p className={`font-medium ${
                              formData.loan_type === type.value
                                ? 'text-primary-600'
                                : 'text-gray-900'
                            }`}>{type.label}</p>
                            <p className="text-sm text-gray-500">{type.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Loan Details */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Loan Details</h2>
                <div className="space-y-6">
                  <div>
                    <label className="label">Loan Amount (Rs)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        name="loan_amount"
                        value={formData.loan_amount}
                        onChange={handleInputChange}
                        className="input-field pl-10"
                        placeholder="Enter loan amount"
                        min="100000"
                        required
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Minimum: Rs 1 Lakh</p>
                  </div>

                  <div>
                    <label className="label">Tenure (Months)</label>
                    <select
                      name="tenure_months"
                      value={formData.tenure_months}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select tenure</option>
                      {[12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 180, 240, 300, 360].map((months) => (
                        <option key={months} value={months}>
                          {months} months ({(months / 12).toFixed(0)} years)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">Purpose of Loan</label>
                    <textarea
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleInputChange}
                      className="input-field"
                      rows={3}
                      placeholder="Describe the purpose of your loan or type NA..."
                    />
                  </div>

                  { (
                    <>
                      <div>
                        <label className="label">Property Address</label>
                        <textarea
                          name="property_address"
                          value={formData.property_address}
                          onChange={handleInputChange}
                          className="input-field"
                          rows={2}
                          placeholder="Enter property address if required"
                        />
                      </div>
                      <div>
                        <label className="label">Property Value (Rs)</label>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            name="property_value"
                            value={formData.property_value}
                            onChange={handleInputChange}
                            className="input-field pl-10"
                            placeholder="Enter property value if required"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Employment Details */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Employment Details</h2>
                <div className="space-y-6">
                  <div>
                    <label className="label">Employment Type</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {employmentTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, employment_type: type.value }))}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            formData.employment_type === type.value
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-gray-200 hover:border-primary-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Briefcase className={`w-5 h-5 ${
                              formData.employment_type === type.value
                                ? 'text-primary-600'
                                : 'text-gray-600'
                            }`} />
                            <span className={`font-medium ${
                              formData.employment_type === type.value
                                ? 'text-primary-600'
                                : 'text-gray-900'
                            }`}>{type.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="label">Monthly Income (Rs)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        name="monthly_income"
                        value={formData.monthly_income}
                        onChange={handleInputChange}
                        className="input-field pl-10"
                        placeholder="Enter your monthly income"
                        min="10000"
                        required
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Minimum: Rs 10,000</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Personal Details */}
            {step === 4 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Details</h2>
                <div className="space-y-6">
                  <div>
                    <label className="label">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="applicant_name"
                        value={formData.applicant_name}
                        onChange={handleInputChange}
                        className="input-field pl-10"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        name="applicant_email"
                        value={formData.applicant_email}
                        onChange={handleInputChange}
                        className="input-field bg-gray-100"
                        placeholder="Enter your email"
                        disabled
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">Phone Number</label>
                    <input
                      type="tel"
                      name="applicant_phone"
                      value={formData.applicant_phone}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary ml-auto"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary ml-auto flex items-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-2" />
                      Submit Application
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoanApplicationPage;