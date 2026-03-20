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
  ArrowRight
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
      features: ['Property is used as collateral to borrow money','Options are available for both fixed and floating interest rates.']
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
      description: 'top-up loan allows borrowers to secure additional funds on top of an existing personal or home loan',
      features: ['lower interest rates', 'offer longer repayment tenures']
    },
    {
      icon: RefreshCw,
      title: 'Balance Transfer',
      description: 'Transfer your existing home loan to enjoy lower interest rates and save money.',
      features: ['Lower EMI options', 'Top-up loan facility', 'Minimal documentation']
    },
    {
      icon: Landmark,
      title: 'Commercial loan',
      description: 'Commercial loans provide businesses with essential capital for growth.',
      features: ['Long repayment tenures', 'High Loan Amounts',]
    }
  ];

  const stats = [
    { value: '50,000+', label: 'Happy Customers' },
    { value: 'Rs 5,000 Cr+', label: 'Loans Disbursed' },
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
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTR2Mkg2MHYtMkgzNnpNMTIgMjZWMjRIMFYyaDEyVjI2em0xMiAwVjE0SDI0VjI2SDI0em0tMTIgMFY0SDBWMjZIMTB6bTI0LTVIMjBWMjFoNHYtMXptMC00VjE4aC00djJoNHYtMnptMC00VjE0aC00djJoNHYtMnptMC00VjEwaC00djJoNHYtMnptMC00VjZoLTR2Mmg0VjZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Your Dream Home
                <span className="block text-primary-200">Is Just a Click Away</span>
              </h1>
              <p className="text-xl text-primary-100 mb-8 max-w-lg">
                Get the best home loan deals with minimal possible interest rates.
                Quick approval, minimal documentation, and doorstep service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to="/apply" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 text-center">
                  Apply Now
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </Link>
                <Link to="/emi-calculator" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 text-center">
                  Calculate EMI
                </Link>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="text-center">
                  <div className="bg-white rounded-xl p-6 shadow-xl">
                    <p className="text-gray-600 mb-2">Starting from</p>
                    <p className="text-4xl font-bold text-primary-600">Minimal Possible</p>
                    <p className="text-gray-500">interest rate</p>
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 inline text-green-500 mr-1" />
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
      <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary-600">{stat.value}</p>
                <p className="text-gray-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Loan Services</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              We offer a comprehensive range of home finance solutions tailored to meet your unique needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="card hover:shadow-xl transition-shadow group">
                <div className="bg-primary-50 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                  <service.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/apply"
                  className="mt-4 inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
                >
                  Apply Now <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose GP Home Finance?</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              We are committed to making your home loan journey smooth and hassle-free.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Your Dream Home?
          </h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Apply now and get instant approval. Our experts will guide you through the entire process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/apply" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
              Start Your Application
            </Link>
            <Link to="/contact" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Partner Banks Section */}
      <section className="py-20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <h2 className="section-title">Our Partner Banks</h2>
      <p className="section-subtitle">
        We work with India's leading banks to bring you the best loan offers.
      </p>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
      {[
        { name: 'HDFC Bank', link: 'https://homeloans.hdfc.bank.in/' },
        { name: 'ICICI Bank', link: 'https://www.icici.bank.in/personal-banking/loans/home-loan' },
        { name: 'Axis Bank', link: 'https://www.axis.bank.in/loans/home-loan' },
        { name: 'LIC Housing', link: 'https://www.lichousing.com' },
        { name: 'LNT', link: 'https://www.ltfinance.com/home-loan' },
        { name: 'Bajaj', link: 'https://www.bajajfinserv.in/home-loan-fresh-form?utm_source=BFLGOOGLESEARCHMKTG&utm_medium=cpc&utm_campaign=DPPM_HL_OB_ARM_Search_Open_Brand_Ex_BHL_Core&gad_source=1&gad_campaignid=21009029030&gbraid=0AAAAADgxadmHZ04OAPG-TCbcmD3GMMXd6&gclid=Cj0KCQjw9-PNBhDfARIsABHN6-0m1TT0yZcc5giehxOSH7D-Cij0Talhw9vDtKCIahL8dH3MDzdFGbgaAgaaEALw_wcB' },
        { name: 'Tata', link: 'https://www.tatacapital.com/home-loan.html' },
        { name: 'Kotak', link: 'https://www.kotak.bank.in/en/personal-banking/loans/home-loan.html' },
        { name: 'PNB Housing', link: 'https://www.pnbhousing.com/' }
      ].map((bank, index) => (
        <div
          key={index}
          className="bg-gray-100 rounded-lg p-6 text-center hover:shadow-md transition-shadow"
        >
          <a
            href={bank.link}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gray-700 hover:text-blue-600"
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