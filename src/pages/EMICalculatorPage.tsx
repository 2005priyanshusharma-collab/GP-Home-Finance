import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, IndianRupee, Clock, Percent } from 'lucide-react';

interface AmortizationRow {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

const EMICalculatorPage: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.35);
  const [tenure, setTenure] = useState(20);

  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [amortizationSchedule, setAmortizationSchedule] = useState<AmortizationRow[]>([]);

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, tenure]);

  const calculateEMI = () => {
    const P = loanAmount;
    const r = interestRate / 100 / 12;
    const n = tenure * 12;

    if (P <= 0 || r <= 0 || n <= 0) {
      setEmi(0);
      setTotalInterest(0);
      setTotalAmount(0);
      setAmortizationSchedule([]);
      return;
    }

    // EMI formula: EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
    const emiValue = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const totalAmountValue = emiValue * n;
    const totalInterestValue = totalAmountValue - P;

    setEmi(emiValue);
    setTotalInterest(totalInterestValue);
    setTotalAmount(totalAmountValue);

    // Generate amortization schedule
    const schedule: AmortizationRow[] = [];
    let balance = P;

    for (let month = 1; month <= n; month++) {
      const interest = balance * r;
      const principal = emiValue - interest;
      balance -= principal;

      schedule.push({
        month,
        emi: Math.round(emiValue),
        principal: Math.round(principal),
        interest: Math.round(interest),
        balance: Math.max(0, Math.round(balance)),
      });
    }

    setAmortizationSchedule(schedule);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Quick loan amount presets
  const loanPresets = [1000000, 2500000, 5000000, 7500000, 10000000, 15000000, 20000000];
  const tenurePresets = [5, 10, 15, 20, 25, 30];
  const ratePresets = [8.0, 8.35, 8.5, 9.0, 9.5, 10.0];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="section-title">EMI Calculator</h1>
          <p className="section-subtitle">
            Calculate your home loan EMI instantly. Adjust the values to find the perfect plan for you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Input */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Calculator className="w-6 h-6 mr-2 text-primary-600" />
              Loan Parameters
            </h2>

            {/* Loan Amount */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="label mb-0">Loan Amount</label>
                <span className="text-primary-600 font-semibold">{formatCurrency(loanAmount)}</span>
              </div>
              <input
                type="range"
                min="100000"
                max="50000000"
                step="100000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Rs 1 Lakh</span>
                <span>Rs 5 Crore</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {loanPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setLoanAmount(preset)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      loanAmount === preset
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {preset >= 10000000 ? `${preset / 10000000} Cr` : `${preset / 100000} L`}
                  </button>
                ))}
              </div>
            </div>

            {/* Interest Rate */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="label mb-0">Interest Rate (p.a.)</label>
                <span className="text-primary-600 font-semibold">{interestRate}%</span>
              </div>
              <input
                type="range"
                min="6"
                max="15"
                step="0.05"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>6%</span>
                <span>15%</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {ratePresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setInterestRate(preset)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      interestRate === preset
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {preset}%
                  </button>
                ))}
              </div>
            </div>

            {/* Tenure */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="label mb-0">Tenure</label>
                <span className="text-primary-600 font-semibold">{tenure} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={tenure}
                onChange={(e) => setTenure(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 Year</span>
                <span>30 Years</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {tenurePresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setTenure(preset)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      tenure === preset
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {preset} Years
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div>
            {/* EMI Card */}
            <div className="card bg-gradient-to-br from-primary-600 to-primary-800 text-white mb-6">
              <div className="text-center">
                <p className="text-primary-100 mb-1">Your Monthly EMI</p>
                <p className="text-4xl md:text-5xl font-bold mb-2">{formatCurrency(emi)}</p>
                <p className="text-primary-200 text-sm">
                  for {tenure} years at {interestRate}% interest rate
                </p>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div className="card">
                <div className="flex items-justify space-x-0.1">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <IndianRupee className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Principal Amount</p>
                    <p className="text-x1 font-bold text-gray-900">{formatCurrency(loanAmount)} </p>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="flex items-center space-x-1">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Total Interest</p>
                    <p className="text-x1 font-bold text-gray-900">{formatCurrency(totalInterest)}</p>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="flex items-center space-x-1">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Percent className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Interest Rate</p>
                    <p className="text-xl font-bold text-gray-900">{interestRate}% p.a.</p>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Tenure</p>
                    <p className="text-xl font-bold text-gray-900">{tenure} Years</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Amount Card */}
            <div className="card border-2 border-primary-200 bg-primary-50">
              <div className="text-center">
                <p className="text-gray-600 mb-1">Total Amount Payable</p>
                <p className="text-3xl font-bold text-primary-700">{formatCurrency(totalAmount)}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Principal: {formatCurrency(loanAmount)} + Interest: {formatCurrency(totalInterest)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Amortization Schedule */}
        <div className="card mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Amortization Schedule</h2>
          <p className="text-gray-600 mb-4">
            View how your EMI is split between principal and interest over time.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Year</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">EMI (Annual)</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Principal</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Interest</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Balance</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: tenure }, (_, yearIndex) => {
                  const startMonth = yearIndex * 12;
                  const endMonth = Math.min(startMonth + 12, amortizationSchedule.length);
                  const yearData = amortizationSchedule.slice(startMonth, endMonth);
                  const annualEmi = yearData.reduce((sum, row) => sum + row.emi, 0);
                  const annualPrincipal = yearData.reduce((sum, row) => sum + row.principal, 0);
                  const annualInterest = yearData.reduce((sum, row) => sum + row.interest, 0);
                  const yearEndBalance = yearData[yearData.length - 1]?.balance || 0;

                  return (
                    <tr key={yearIndex} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">Year {yearIndex + 1}</td>
                      <td className="py-3 px-4 text-right">{formatCurrency(annualEmi)}</td>
                      <td className="py-3 px-4 text-right text-green-600">{formatCurrency(annualPrincipal)}</td>
                      <td className="py-3 px-4 text-right text-red-500">{formatCurrency(annualInterest)}</td>
                      <td className="py-3 px-4 text-right">{formatCurrency(yearEndBalance)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="card mt-8 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Ready to Apply?</h3>
              <p className="text-primary-100">Get the best home loan rates with GP Home Finance</p>
            </div>
            <a
              href="/apply"
              className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Apply Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EMICalculatorPage;