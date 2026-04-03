import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, ArrowUpRight } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-600 text-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="border border-accent-500 text-accent-500 px-3 py-1.5 rounded">
                <span className="font-semibold text-lg tracking-wide">GP</span>
              </div>
              <span className="font-medium text-white text-sm tracking-widest uppercase">
                Home Finance
              </span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
              Your trusted partner for home loans and financial solutions. We help you achieve your dream of owning a home.
            </p>
            <div className="flex space-x-4">
              {['Facebook', 'Twitter', 'LinkedIn', 'Instagram'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-neutral-500 hover:text-accent-500 transition-colors duration-300 text-xs tracking-widest uppercase"
                >
                  {social.slice(0, 2)}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-xs font-medium tracking-widest uppercase mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Apply for Loan', path: '/apply' },
                { name: 'EMI Calculator', path: '/emi-calculator' },
                { name: 'Contact Us', path: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-neutral-400 hover:text-accent-500 text-sm transition-colors duration-300 flex items-center group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white text-xs font-medium tracking-widest uppercase mb-6">Our Services</h3>
            <ul className="space-y-3">
              {[
                { name: 'Home Purchase Loan', path: '/apply?loan=home_purchase' },
                { name: 'Mortgage Loan', path: '/apply?loan=mortgage_loan' },
                { name: 'Top-up Loan', path: '/apply?loan=topup_loan' },
                { name: 'Balance Transfer', path: '/apply?loan=balance_transfer' },
                { name: 'Commercial Loan', path: '/apply?loan=commercial_purchase' },
                { name: 'Personal Loan', path: '/apply?loan=Personal_purchase' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-neutral-400 hover:text-accent-500 text-sm transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-xs font-medium tracking-widest uppercase mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-accent-500" />
                <span className="text-sm">+91 9028088862</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-accent-500" />
                <span className="text-sm">gphomefinance@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-500 text-xs tracking-wide">
            &copy; {currentYear} GP Home Finance. All rights reserved.
          </p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <Link to="/privacy" className="text-neutral-500 hover:text-accent-500 text-xs tracking-wide transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-neutral-500 hover:text-accent-500 text-xs tracking-wide transition-colors duration-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;