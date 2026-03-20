import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-primary-500 to-primary-700 text-white px-3 py-1 rounded-lg">
                <span className="font-bold text-xl">GP</span>
              </div>
              <span className="font-semibold text-white text-lg">Home Finance</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted partner for home loans and financial solutions. We help you achieve your dream of owning a home.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/apply" className="hover:text-primary-400 transition-colors">
                  Apply for Loan
                </Link>
              </li>
              <li>
                <Link to="/emi-calculator" className="hover:text-primary-400 transition-colors">
                  EMI Calculator
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/apply?loan=home_purchase" className="hover:text-primary-400 transition-colors">
                  Home Purchase Loan
                </Link>
              </li>
              <li>
                <Link to="/apply?loan=mortgage_loan" className="hover:text-primary-400 transition-colors">
                  Mortgage Loan
                </Link>
              </li>
              <li>
                <Link to="/apply?loan=topup_loan" className="hover:text-primary-400 transition-colors">
                  Top-up Loan
                </Link>
              </li>
              <li>
                <Link to="/apply?loan=balance_transfer" className="hover:text-primary-400 transition-colors">
                  Balance Transfer
                </Link>
              </li>
              <li>
                <Link to="/apply?loan=commercial_purchase" className="hover:text-primary-400 transition-colors">
                  Commercial Purchase Loan
                </Link>
              </li>
              <li>
                <Link to="/apply?loan=Personal_purchase" className="hover:text-primary-400 transition-colors">
                  Personal Loan
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-400" />
                <span>+91 9028088862</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-400" />
                <span>gphomefinance@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} GP Home Finance. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-primary-400 text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-primary-400 text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;