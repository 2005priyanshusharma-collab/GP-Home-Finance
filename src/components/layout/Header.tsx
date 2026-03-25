import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Menu,
  X,
  Home,
  Wrench,
  Building,
  Calculator,
  FileText,
  Phone,
  User,
  LogOut,
  LayoutDashboard
} from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const navLinks = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'EMI Calculator', path: '/emi-calculator', icon: Calculator },
    { name: 'Apply for Loan', path: '/apply', icon: FileText },
    { name: 'Contact', path: '/contact', icon: Phone },
    { name: 'Our Product', id: 'services', icon: Wrench, type: 'scroll' },
    { name: 'Banks', id: 'Banks', icon: Building, type: 'scroll' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white px-3 py-1 rounded-lg">
              <span className="font-bold text-xl">GP</span>
            </div>
            <span className="font-semibold text-gray-900 text-lg hidden sm:block">
              Home Finance
            </span>
          </Link>

          {/* Desktop Navigation — hidden on mobile */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link, index) => {
              if (link.type === 'scroll') {
                return (
                  <button
                    key={index}
                    onClick={() => scrollToSection(link.id!)}
                    className="text-gray-600 hover:text-primary-600 font-medium transition-colors flex items-center space-x-1"
                  >
                    <link.icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </button>
                );
              }
              return (
                <Link
                  key={index}
                  to={link.path!}
                  className="text-gray-600 hover:text-primary-600 font-medium transition-colors flex items-center space-x-1"
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Buttons — hidden on mobile */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-primary-600 font-medium flex items-center space-x-1"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-600 font-medium flex items-center space-x-1"
                >
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link to="/signup" className="btn-primary">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu — all links including scroll ones */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link, index) => {
                if (link.type === 'scroll') {
                  return (
                    <button
                      key={index}
                      onClick={() => scrollToSection(link.id!)}
                      className="text-left text-gray-600 hover:text-primary-600 font-medium flex items-center space-x-2 py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <link.icon className="w-5 h-5" />
                      <span>{link.name}</span>
                    </button>
                  );
                }
                return (
                  <Link
                    key={index}
                    to={link.path!}
                    className="text-gray-600 hover:text-primary-600 font-medium flex items-center space-x-2 py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <link.icon className="w-5 h-5" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}

              {/* Auth links in mobile menu */}
              <div className="border-t pt-3 mt-2">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="text-gray-600 hover:text-primary-600 font-medium flex items-center space-x-2 py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left text-gray-600 hover:text-red-600 font-medium flex items-center space-x-2 py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-gray-600 hover:text-primary-600 font-medium flex items-center space-x-2 py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/signup"
                      className="btn-primary text-center block mt-2 mx-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;