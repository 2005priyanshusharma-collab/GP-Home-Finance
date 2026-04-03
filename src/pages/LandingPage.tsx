import React from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Building2,
  Wrench,
  MapPin,
  RefreshCw,
  Landmark,
  Calculator,
  Shield,
  Clock,
  HeadphonesIcon,
  CheckCircle,
  ArrowRight,
  ArrowUpRight
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const services = [
    {
      icon: Home,
      title: 'Home Loan',
      description: 'Finance your dream home with competitive interest rates starting from 8.35% p.a.',
      features: ['Up to 90% funding', 'Flexible tenure up to 30 years', 'Quick approval process']
    },
    {
      icon: Building2,
      title: 'Mortgage Loan',
      description: 'Unlock your dream home with confidence',
      features: ['Property is used as collateral to borrow money', 'Options are available for both fixed and floating interest rates.']
    },
    {
      icon: Wrench,
      title: 'Personal Loan',
      description: 'Personal loans are unsecured, multi-purpose loans offering rapid, often 24-hour, digital disbursement without requiring collateral.',
      features: ['No collateral required', 'Quick processing']
    },
    {
      icon: MapPin,
      title: 'Top-Up Loan',
      description: 'A top-up loan allows borrowers to secure additional funds on top of an existing personal or home loan',
      features: ['Lower interest rates', 'Offer longer repayment tenures']
    },
    {
      icon: RefreshCw,
      title: 'Balance Transfer',
      description: 'Transfer your existing home loan to enjoy lower interest rates and save money.',
      features: ['Lower EMI options', 'Top-up loan facility', 'Minimal documentation']
    },
    {
      icon: Landmark,
      title: 'Commercial Loan',
      description: 'Commercial loans provide businesses with essential capital for growth.',
      features: ['Long repayment tenures', 'High Loan Amounts']
    }
  ];

  const stats = [
    { value: '50,000+', label: 'Happy Customers' },
    { value: '₹5,000 Cr+', label: 'Loans Disbursed' },
    { value: '98%', label: 'Customer Satisfaction' },
    { value: '25+', label: 'Years of Experience' }
  ];

  const whyChooseUs = [
    {
      icon: Calculator,
      title: 'Transparent Pricing',
      description: 'No hidden charges. All costs are clearly communicated upfront.'
    },
    {
      icon: Shield,
      title: 'Secure Process',
      description: 'Your data is protected with bank-grade security measures.'
    },
    {
      icon: Clock,
      title: 'Quick Processing',
      description: 'Fast approval and disbursement with minimal documentation.'
    },
    {
      icon: HeadphonesIcon,
      title: '24/7 Support',
      description: 'Our dedicated team is always available to assist you.'
    }
  ];

  return (
    <div className="bg-surface-50">
      {/* Hero Section */}
      <section className="relative bg-primary-600 text-white overflow-hidden">
        {/* Subtle geometric pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/[0.03] to-transparent" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-accent-500/[0.05] -translate-x-1/2 translate-y-1/2" />
          <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-accent-500/[0.04]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="text-center md:text-left animate-fade-in">
              <p className="text-accent-500 text-xs font-medium tracking-[0.2em] uppercase mb-6">
                Trusted Home Finance Partner
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 leading-tight tracking-tight">
                Your Dream Home
                <span className="block font-semibold text-accent-400 mt-2">Is Just a Click Away</span>
              </h1>
              <p className="text-lg text-neutral-300 mb-10 max-w-lg font-light leading-relaxed">
                Get the best home loan deals with minimal possible interest rates.
                Quick approval, minimal documentation, and doorstep service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to="/apply" className="btn-accent inline-flex items-center justify-center group">
                  Apply Now
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link to="/emi-calculator" className="btn-secondary border-white/30 text-white hover:bg-white hover:text-primary-600 text-center">
                  Calculate EMI
                </Link>
              </div>
            </div>

            <div className="hidden md:block animate-fade-in animate-stagger-3">
              <div className="border border-white/10 rounded-lg p-10 backdrop-blur-sm">
                <div className="text-center">
                  <div className="bg-white rounded-lg p-8">
                    <p className="text-neutral-500 text-xs tracking-widest uppercase mb-3">Starting from</p>
                    <p className="text-4xl font-light text-primary-600 tracking-tight">Minimal Possible</p>
                    <p className="text-neutral-400 text-sm mt-1">interest rate</p>
                    <div className="mt-6 pt-6 border-t border-neutral-200">
                      <p className="text-sm text-neutral-600 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        Lowest EMI guaranteed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b border-neutral-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <p className="text-3xl md:text-4xl font-light text-primary-600 tracking-tight">{stat.value}</p>
                <p className="text-neutral-500 mt-2 text-sm tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <p className="text-accent-600 text-xs font-medium tracking-[0.2em] uppercase mb-4">What We Offer</p>
            <h2 className="section-title">Our Loan Services</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              We offer a comprehensive range of home finance solutions tailored to meet your unique needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="card group hover:border-accent-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-lg bg-surface-100 flex items-center justify-center mb-5 group-hover:bg-accent-50 transition-colors duration-300">
                  <service.icon className="w-5 h-5 text-primary-600 group-hover:text-accent-600 transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-medium text-primary-600 mb-2 tracking-tight">{service.title}</h3>
                <p className="text-neutral-500 text-sm mb-4 leading-relaxed">{service.description}</p>
                <ul className="space-y-2 mb-5">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-neutral-500">
                      <span className="w-1 h-1 rounded-full bg-accent-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/apply"
                  className="inline-flex items-center text-sm text-primary-600 font-medium hover:text-accent-600 transition-colors duration-300 group/link"
                >
                  Apply Now
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-white border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <p className="text-accent-600 text-xs font-medium tracking-[0.2em] uppercase mb-4">Why Us</p>
            <h2 className="section-title">Why Choose GP Home Finance?</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              We are committed to making your home loan journey smooth and hassle-free.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div
                key={index}
                className="text-center group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 rounded-full border border-neutral-200 flex items-center justify-center mx-auto mb-5 group-hover:border-accent-400 group-hover:bg-accent-50 transition-all duration-300">
                  <item.icon className="w-6 h-6 text-primary-600 group-hover:text-accent-600 transition-colors duration-300" />
                </div>
                <h3 className="text-base font-medium text-primary-600 mb-2">{item.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <p className="text-accent-500 text-xs font-medium tracking-[0.2em] uppercase mb-4">Get Started Today</p>
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-tight">
            Ready to Get Your Dream Home?
          </h2>
          <p className="text-neutral-400 mb-10 max-w-2xl mx-auto font-light">
            Apply now and get instant approval. Our experts will guide you through the entire process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/apply" className="btn-accent inline-flex items-center justify-center group">
              Start Your Application
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link to="/contact" className="btn-secondary border-white/20 text-white hover:bg-white hover:text-primary-600">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Partner Banks Section */}
      <section id="Banks" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <p className="text-accent-600 text-xs font-medium tracking-[0.2em] uppercase mb-4">Our Partners</p>
            <h2 className="section-title">Our Banking Partners</h2>
            <p className="section-subtitle">
              We work with India's leading banks to bring you the best loan offers.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'HDFC Bank', link: 'https://homeloans.hdfc.bank.in/' },
              { name: 'ICICI Bank', link: 'https://www.icici.bank.in/personal-banking/loans/home-loan' },
              { name: 'Axis Bank', link: 'https://www.axis.bank.in/loans/home-loan' },
              { name: 'LIC Housing', link: 'https://www.lichousing.com' },
              { name: 'LNT', link: 'https://www.ltfinance.com/home-loan' },
              { name: 'Bajaj', link: 'https://www.bajajfinserv.in/home-loan-fresh-form?utm_source=BFLGOOGLESEARCHMKTG&utm_medium=cpc&utm_campaign=DPPM_HL_OB_ARM_Search_Open_Brand_Ex_BHL_Core&gad_source=1&gad_campaignid=21009029030&gbraid=0AAAAADgxadmHZ04OAPG-TCbcmD3GMMXd6&gclid=Cj0KCQjw9-PNBhDfARIsABHN6-0m1TT0yZcc5giehxOSH7D-Cij0Talhw9vDtKCIahL8dH3MDzdFGbgaAgaaEALw_wcB' },
              { name: 'Tata', link: 'https://www.tatacapital.com/home-loan.html' },
              { name: 'Kotak', link: 'https://www.kotak.bank.in/en/personal-banking/loans/home-loan.html' },
              { name: 'PNB Housing', link: 'https://www.pnbhousing.com/' },
              { name: 'YES Bank', link: 'https://www.yes.bank.in/personal-banking/yes-individual/loans/home-loan' },
              { name: 'SBI Bank', link: 'https://homeloans.sbi.bank.in/' }
            ].map((bank, index) => (
              <div
                key={index}
                className="border border-neutral-200 rounded-lg p-5 text-center hover:border-accent-400 transition-all duration-300 group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <a
                  href={bank.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-neutral-600 group-hover:text-primary-600 transition-colors duration-300"
                >
                  {bank.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;