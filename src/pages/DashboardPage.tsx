import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { LoanApplication, ApplicationStatus } from '../types';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Plus,
  Calendar,
  IndianRupee,
  AlertCircle
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
};

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    totalAmount: applications.reduce((sum, a) => sum + (a.loan_amount || 0), 0),
  };

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
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 animate-fade-in">
          <div>
            <p className="text-accent-600 text-xs font-medium tracking-[0.2em] uppercase mb-2">Dashboard</p>
            <h1 className="text-3xl font-light text-primary-600 tracking-tight">
              Welcome back
            </h1>
            <p className="text-neutral-500 mt-1 text-sm">
              {user?.user_metadata?.full_name || user?.email}
            </p>
          </div>
          <Link to="/apply" className="btn-primary mt-4 md:mt-0 inline-flex items-center text-sm">
            <Plus className="w-4 h-4 mr-2" />
            New Application
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {[
            { label: 'Total Applications', value: stats.total, icon: FileText, color: 'text-primary-600', bg: 'bg-surface-100' },
            { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Total Loan Amount', value: formatCurrency(stats.totalAmount), icon: TrendingUp, color: 'text-accent-600', bg: 'bg-accent-50' },
          ].map((stat, index) => (
            <div
              key={index}
              className="card animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-500 text-xs tracking-wide">{stat.label}</p>
                  <p className={`text-2xl font-light mt-1 tracking-tight ${stat.label === 'Total Loan Amount' ? 'text-xl' : ''} text-primary-600`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bg} p-3 rounded-lg`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Applications List */}
        <div className="card animate-fade-in-up animate-stagger-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-primary-600 tracking-tight">Your Applications</h2>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {applications.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-16 h-16 rounded-full border border-neutral-200 flex items-center justify-center mx-auto mb-5">
                <FileText className="w-6 h-6 text-neutral-300" />
              </div>
              <h3 className="text-lg font-light text-primary-600 mb-2">No applications yet</h3>
              <p className="text-neutral-500 text-sm mb-6">
                Start your home loan journey by submitting your first application.
              </p>
              <Link to="/apply" className="btn-primary inline-flex items-center text-sm">
                <Plus className="w-4 h-4 mr-2" />
                Apply for Loan
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-3 px-4 font-medium text-neutral-500 text-xs tracking-widest uppercase">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-500 text-xs tracking-widest uppercase">Loan Type</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-500 text-xs tracking-widest uppercase">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-500 text-xs tracking-widest uppercase">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-500 text-xs tracking-widest uppercase">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-500 text-xs tracking-widest uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application) => {
                    const StatusIcon = statusColors[application.status]?.icon || Clock;
                    return (
                      <tr key={application.id} className="border-b border-neutral-100 hover:bg-surface-50 transition-colors duration-200">
                        <td className="py-4 px-4">
                          <span className="font-mono text-xs text-neutral-500">
                            {application.id.slice(0, 8).toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium text-primary-600 text-sm">
                            {loanTypeLabels[application.loan_type] || application.loan_type}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="flex items-center text-sm text-neutral-700">
                            <IndianRupee className="w-3.5 h-3.5 mr-1" />
                            {new Intl.NumberFormat('en-IN').format(application.loan_amount)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border ${statusColors[application.status]?.bg} ${statusColors[application.status]?.text} ${statusColors[application.status]?.border}`}>
                            <StatusIcon className="w-3 h-3 mr-1.5" />
                            {statusLabels[application.status]}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="flex items-center text-neutral-500 text-sm">
                            <Calendar className="w-3.5 h-3.5 mr-1.5" />
                            {formatDate(application.created_at)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <Link
                            to={`/application/${application.id}`}
                            className="text-accent-600 hover:text-accent-700 text-sm font-medium transition-colors duration-300"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;