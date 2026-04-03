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

    const emiValue = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const totalAmountValue = emiValue * n;
    const totalInterestValue = totalAmountValue - P;

    setEmi(emiValue);
    setTotalInterest(totalInterestValue);
    setTotalAmount(totalAmountValue);

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

  const loanPresets = [1000000, 2500000, 5000000, 7500000, 10000000, 15000000, 20000000];
  const tenurePresets = [5, 10, 15, 20, 25, 30];
  const ratePresets = [8.0, 8.35, 8.5, 9.0, 9.5, 10.0];

  return (
    <div className="min-h-screen bg-surface-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <p className="text-accent-600 text-xs font-medium tracking-[0.2em] uppercase mb-4">Financial Tools</p>
          <h1 className="section-title">EMI Calculator</h1>
          <p className="section-subtitle">
            Calculate your home loan EMI instantly. Adjust the values to find the perfect plan for you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Input */}
          <div className="card animate-fade-in-up">
            <h2 className="text-lg font-medium text-primary-600 mb-6 flex items-center tracking-tight">
              <Calculator className="w-5 h-5 mr-2 text-accent-500" />
              Loan Parameters
            </h2>

            {/* Loan Amount */}
            <div className="mb-8">
              <div className="flex justify-between mb-3">
                <label className="label mb-0">Loan Amount</label>
                <span className="text-primary-600 font-medium text-sm">{formatCurrency(loanAmount)}</span>
              </div>
              <input
                type="range"
                min="100000"
                max="50000000"
                step="100000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-neutral-400 mt-1">
                <span>₹1 Lakh</span>
                <span>₹5 Crore</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {loanPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setLoanAmount(preset)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all duration-300 ${
                      loanAmount === preset
                        ? 'bg-primary-600 text-white'
                        : 'bg-surface-100 text-neutral-600 hover:bg-surface-200 border border-neutral-200'
                    }`}
                  >
                    {preset >= 10000000 ? `${preset / 10000000} Cr` : `${preset / 100000} L`}
                  </button>
                ))}
              </div>
            </div>

            {/* Interest Rate */}
            <div className="mb-8">
              <div className="flex justify-between mb-3">
                <label className="label mb-0">Interest Rate (p.a.)</label>
                <span className="text-primary-600 font-medium text-sm">{interestRate}%</span>
              </div>
              <input
                type="range"
                min="6"
                max="15"
                step="0.05"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-neutral-400 mt-1">
                <span>6%</span>
                <span>15%</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {ratePresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setInterestRate(preset)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all duration-300 ${
                      interestRate === preset
                        ? 'bg-primary-600 text-white'
                        : 'bg-surface-100 text-neutral-600 hover:bg-surface-200 border border-neutral-200'
                    }`}
                  >
                    {preset}%
                  </button>
                ))}
              </div>
            </div>

            {/* Tenure */}
            <div>
              <div className="flex justify-between mb-3">
                <label className="label mb-0">Tenure</label>
                <span className="text-primary-600 font-medium text-sm">{tenure} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={tenure}
                onChange={(e) => setTenure(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-neutral-400 mt-1">
                <span>1 Year</span>
                <span>30 Years</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {tenurePresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setTenure(preset)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all duration-300 ${
                      tenure === preset
                        ? 'bg-primary-600 text-white'
                        : 'bg-surface-100 text-neutral-600 hover:bg-surface-200 border border-neutral-200'
                    }`}
                  >
                    {preset} Yrs
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="animate-fade-in-up animate-stagger-2">
            {/* EMI Card */}
            <div className="card bg-primary-600 text-white mb-6 border-primary-600">
              <div className="text-center py-4">
                <p className="text-neutral-300 text-xs tracking-widest uppercase mb-2">Your Monthly EMI</p>
                <p className="text-4xl md:text-5xl font-light tracking-tight mb-2">{formatCurrency(emi)}</p>
                <p className="text-neutral-400 text-sm">
                  for {tenure} years at {interestRate}% interest rate
                </p>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              {[
                { icon: IndianRupee, label: 'Principal Amount', value: formatCurrency(loanAmount), color: 'text-primary-600', bg: 'bg-surface-100' },
                { icon: TrendingUp, label: 'Total Interest', value: formatCurrency(totalInterest), color: 'text-accent-600', bg: 'bg-accent-50' },
                { icon: Percent, label: 'Interest Rate', value: `${interestRate}% p.a.`, color: 'text-green-600', bg: 'bg-green-50' },
                { icon: Clock, label: 'Tenure', value: `${tenure} Years`, color: 'text-primary-500', bg: 'bg-surface-100' },
              ].map((item, index) => (
                <div key={index} className="card">
                  <div className="flex items-center space-x-4">
                    <div className={`${item.bg} p-3 rounded-lg`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div>
                      <p className="text-neutral-500 text-xs tracking-wide">{item.label}</p>
                      <p className="text-lg font-medium text-primary-600 tracking-tight">{item.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Amount Card */}
            <div className="card border-accent-300 bg-accent-50">
              <div className="text-center">
                <p className="text-neutral-600 text-xs tracking-widest uppercase mb-2">Total Amount Payable</p>
                <p className="text-3xl font-light text-primary-600 tracking-tight">{formatCurrency(totalAmount)}</p>
                <p className="text-sm text-neutral-500 mt-2">
                  Principal: {formatCurrency(loanAmount)} + Interest: {formatCurrency(totalInterest)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Amortization Schedule */}
        <div className="card mt-8 animate-fade-in-up animate-stagger-4">
          <h2 className="text-lg font-medium text-primary-600 mb-2 tracking-tight">Amortization Schedule</h2>
          <p className="text-neutral-500 text-sm mb-6">
            View how your EMI is split between principal and interest over time.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 font-medium text-neutral-500 text-xs tracking-widest uppercase">Year</th>
                  <th className="text-right py-3 px-4 font-medium text-neutral-500 text-xs tracking-widest uppercase">EMI (Annual)</th>
                  <th className="text-right py-3 px-4 font-medium text-neutral-500 text-xs tracking-widest uppercase">Principal</th>
                  <th className="text-right py-3 px-4 font-medium text-neutral-500 text-xs tracking-widest uppercase">Interest</th>
                  <th className="text-right py-3 px-4 font-medium text-neutral-500 text-xs tracking-widest uppercase">Balance</th>
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
                    <tr key={yearIndex} className="border-b border-neutral-100 hover:bg-surface-50 transition-colors duration-200">
                      <td className="py-3 px-4 font-medium text-sm text-primary-600">Year {yearIndex + 1}</td>
                      <td className="py-3 px-4 text-right text-sm">{formatCurrency(annualEmi)}</td>
                      <td className="py-3 px-4 text-right text-sm text-green-600">{formatCurrency(annualPrincipal)}</td>
                      <td className="py-3 px-4 text-right text-sm text-red-500">{formatCurrency(annualInterest)}</td>
                      <td className="py-3 px-4 text-right text-sm">{formatCurrency(yearEndBalance)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="card mt-8 bg-primary-600 text-white border-primary-600 animate-fade-in-up animate-stagger-5">
          <div className="flex flex-col md:flex-row items-center justify-between py-2">
            <div>
              <h3 className="text-lg font-medium mb-1 tracking-tight">Ready to Apply?</h3>
              <p className="text-neutral-300 text-sm">Get the best home loan rates with GP Home Finance</p>
            </div>
            <a
              href="/apply"
              className="mt-4 md:mt-0 btn-accent inline-flex items-center"
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