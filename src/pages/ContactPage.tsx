import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  AlertCircle,
  CheckCircle,
  MessageSquare
} from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([formData]);

      if (error) throw error;

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to submit your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['+91 9028088862'],
      description: 'Mon-Sat, 9am-7pm',
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['gphomefinance@gmail.com'],
      description: 'We reply within 24 hours',
    },
    {
      icon: MapPin,
      title: 'Office Address',
      details: ['3rd Floor, Siddhi Manora bldg., Near petrol Pump, Virar west'],
      description: 'Visit us for personalized assistance',
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: ['Monday - Saturday: 9:00 AM - 7:00 PM', 'Sunday: Closed'],
      description: 'We are here to help you',
    },
  ];

  const subjects = [
    'General Inquiry',
    'Home Loan Inquiry',
    'Mortgage Loan',
    'Balance Transfer',
    'Document Assistance',
    'Technical Support',
    'Other',
  ];

  return (
    <div className="min-h-screen bg-surface-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <p className="text-accent-600 text-xs font-medium tracking-[0.2em] uppercase mb-4">Get In Touch</p>
          <h1 className="section-title">Contact Us</h1>
          <p className="section-subtitle max-w-2xl mx-auto">
            Have questions about home loans? We are here to help. Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 animate-fade-in-up">
            <div className="card h-full">
              <h2 className="text-lg font-medium text-primary-600 mb-8 tracking-tight">Get in Touch</h2>

              <div className="space-y-8">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="w-10 h-10 rounded-lg bg-surface-100 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-50 transition-colors duration-300">
                      <info.icon className="w-4 h-4 text-primary-600 group-hover:text-accent-600 transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className="font-medium text-primary-600 text-sm">{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-neutral-600 text-sm mt-0.5">{detail}</p>
                      ))}
                      <p className="text-xs text-neutral-400 mt-1">{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-neutral-200">
                <h3 className="font-medium text-primary-600 text-xs tracking-widest uppercase mb-4">Follow Us</h3>
                <div className="flex space-x-3">
                  {['Fb', 'Tw', 'Li', 'Ig'].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="w-9 h-9 rounded-lg bg-surface-100 hover:bg-accent-50 flex items-center justify-center transition-colors duration-300"
                    >
                      <span className="text-xs font-medium text-neutral-500 hover:text-accent-600">{social}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 animate-fade-in-up animate-stagger-2">
            <div className="card">
              <h2 className="text-lg font-medium text-primary-600 mb-6 flex items-center tracking-tight">
                <MessageSquare className="w-5 h-5 mr-2 text-accent-500" />
                Send us a Message
              </h2>

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3 text-green-700 text-sm">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Thank you! Your message has been sent successfully. We will get back to you soon.</span>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3 text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="label">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="label">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="label">
                      Phone Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="label">
                      Subject <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select a subject</option>
                      {subjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="label">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="input-field"
                    rows={5}
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="card mt-8 animate-fade-in-up animate-stagger-4">
          <h2 className="text-lg font-medium text-primary-600 mb-4 tracking-tight">Our Location</h2>
          <div className="bg-surface-100 h-64 rounded-lg flex items-center justify-center border border-neutral-200">
            <div className="text-center text-neutral-400">
              <MapPin className="w-8 h-8 mx-auto mb-3 text-accent-500" />
              <p className="text-sm text-neutral-600">3rd Floor, Siddhi Manora bldg., Near petrol Pump, Virar west</p>
              <p className="text-xs mt-2">Interactive map coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;