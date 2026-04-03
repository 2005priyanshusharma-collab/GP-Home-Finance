import React, { useState, useEffect } from 'react';
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
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-neutral-200'
          : 'bg-white border-b border-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-primary-600 text-white px-3 py-1.5 rounded transition-all duration-300 group-hover:bg-primary-700">
              <span className="font-semibold text-lg tracking-wide">GP</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-medium text-primary-600 text-sm tracking-widest uppercase">
                Home Finance
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => {
              if (link.type === 'scroll') {
                return (
                  <button
                    key={index}
                    onClick={() => scrollToSection(link.id!)}
                    className="text-neutral-500 hover:text-primary-600 font-normal text-sm tracking-wide transition-colors duration-300 relative group"
                  >
                    <span>{link.name}</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary-600 transition-all duration-300 group-hover:w-full" />
                  </button>
                );
              }
              return (
                <Link
                  key={index}
                  to={link.path!}
                  className="text-neutral-500 hover:text-primary-600 font-normal text-sm tracking-wide transition-colors duration-300 relative group"
                >
                  <span>{link.name}</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary-600 transition-all duration-300 group-hover:w-full" />
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="text-neutral-500 hover:text-primary-600 text-sm font-normal tracking-wide transition-colors duration-300"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-neutral-400 hover:text-red-600 text-sm transition-colors duration-300"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-neutral-500 hover:text-primary-600 text-sm font-normal tracking-wide transition-colors duration-300"
                >
                  Login
                </Link>
                <Link to="/signup" className="btn-primary text-sm py-2 px-6">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5 text-primary-600" /> : <Menu className="w-5 h-5 text-primary-600" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-400 ease-out ${
            isMenuOpen ? 'max-h-[500px] opacity-100 pb-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="border-t border-neutral-200 pt-4">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link, index) => {
                if (link.type === 'scroll') {
                  return (
                    <button
                      key={index}
                      onClick={() => scrollToSection(link.id!)}
                      className="text-left text-neutral-600 hover:text-primary-600 font-normal text-sm tracking-wide flex items-center space-x-3 py-3 px-3 rounded-lg hover:bg-surface-100 transition-all duration-300"
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
                    className="text-neutral-600 hover:text-primary-600 font-normal text-sm tracking-wide flex items-center space-x-3 py-3 px-3 rounded-lg hover:bg-surface-100 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <link.icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}

              <div className="border-t border-neutral-200 pt-3 mt-2">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="text-neutral-600 hover:text-primary-600 font-normal text-sm flex items-center space-x-3 py-3 px-3 rounded-lg hover:bg-surface-100 transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left text-neutral-500 hover:text-red-600 font-normal text-sm flex items-center space-x-3 py-3 px-3 rounded-lg hover:bg-surface-100 transition-all duration-300"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-neutral-600 hover:text-primary-600 font-normal text-sm flex items-center space-x-3 py-3 px-3 rounded-lg hover:bg-surface-100 transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/signup"
                      className="btn-primary text-center block mt-2 mx-3 text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;