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

const statusColors: Record<ApplicationStatus, { bg: string; text: string; icon: typeof Clock }> = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
  under_review: { bg: 'bg-blue-100', text: 'text-blue-700', icon: AlertCircle },
  documents_required: { bg: 'bg-orange-100', text: 'text-orange-700', icon: FileText },
  approved: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
  disbursed: { bg: 'bg-purple-100', text: 'text-purple-700', icon: CheckCircle },
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {user?.user_metadata?.full_name || user?.email}
            </p>
          </div>
          <Link to="/apply" className="btn-primary mt-4 md:mt-0 inline-flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            New Application
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Approved</p>
                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Loan Amount</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Applications</h2>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {applications.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-600 mb-4">
                Start your home loan journey by submitting your first application.
              </p>
              <Link to="/apply" className="btn-primary inline-flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Apply for Loan
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Application ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Loan Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application) => {
                    const StatusIcon = statusColors[application.status]?.icon || Clock;
                    return (
                      <tr key={application.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <span className="font-mono text-sm text-gray-600">
                            {application.id.slice(0, 8).toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium text-gray-900">
                            {loanTypeLabels[application.loan_type] || application.loan_type}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="flex items-center text-gray-900">
                            <IndianRupee className="w-4 h-4 mr-1" />
                            {new Intl.NumberFormat('en-IN').format(application.loan_amount)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${statusColors[application.status]?.bg} ${statusColors[application.status]?.text}`}>
                            <StatusIcon className="w-4 h-4 mr-1" />
                            {statusLabels[application.status]}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(application.created_at)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <Link
                            to={`/application/${application.id}`}
                            className="text-primary-600 hover:text-primary-700 font-medium"
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