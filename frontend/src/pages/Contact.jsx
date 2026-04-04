import React, { useState } from 'react';
import axios from 'axios';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    try {
      const response = await axios.post('https://arpancart.onrender.com/api/contact', formData);

      if (response.data.success || response.status === 200 || response.status === 201) {
        setStatus({ loading: false, success: true, error: null });
        setFormData({ name: '', email: '', subject: '', message: '' }); 
        
        setTimeout(() => setStatus({ loading: false, success: false, error: null }), 4000);
      }
    } catch (err) {
      console.error("Contact Form Error:", err);
      setStatus({ 
        loading: false, 
        success: false, 
        error: err.response?.data?.message || "Failed to send message. Please try again later." 
      });
      
      setTimeout(() => setStatus(prev => ({ ...prev, error: null })), 4000);
    }
  };

  return (
    <div className="bg-[#fcfaf5] min-h-screen py-20 px-6 md:px-12 overflow-hidden">
      
      {/* =========================================
          CSS ANIMATIONS
      ========================================= */}
      <style>
        {`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-up {
            animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto">
        
        {/* =========================================
            HEADER SECTION (Sharp Corporate Decor)
        ========================================= */}
        <div className="text-center mb-16 animate-fade-up">
          <div className="flex items-center justify-center mb-6">
            <div className="hidden md:flex items-center">
              <div className="w-16 lg:w-32 h-[1px] bg-gradient-to-l from-[#8b1818] to-transparent opacity-50"></div>
              <div className="w-2 h-2 bg-[#f7941d] transform rotate-45 mx-4 shadow-sm"></div>
            </div>
            
            <h1 className="text-4xl md:text-[40px] font-extrabold text-[#8b1818] px-4 text-center tracking-wide uppercase">
              Get In Touch
            </h1>

            <div className="hidden md:flex items-center">
              <div className="w-2 h-2 bg-[#f7941d] transform rotate-45 mx-4 shadow-sm"></div>
              <div className="w-16 lg:w-32 h-[1px] bg-gradient-to-r from-[#8b1818] to-transparent opacity-50"></div>
            </div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-center font-medium text-lg leading-relaxed">
            Have questions about our pooja samagri, bulk orders, or subscriptions? We are here to help you on your spiritual journey.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-10 max-w-6xl mx-auto">
          
          {/* =========================================
              LEFT SIDE: CONTACT INFORMATION
          ========================================= */}
          <div className="lg:w-1/3 space-y-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            
            <div className="bg-white p-8 md:p-10 rounded-sm shadow-sm border border-orange-50 h-full relative group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#f7941d] group-hover:bg-[#8b1818] transition-colors duration-500"></div>
              
              <h3 className="text-2xl font-extrabold text-[#8b1818] mb-10 uppercase tracking-wide">Contact Info</h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-5 group/item">
                  <div className="w-12 h-12 bg-[#fffbf4] border border-orange-100 rounded-sm flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#f7941d] group-hover/item:border-[#f7941d] transition-colors duration-300 transform group-hover/item:-translate-y-1">
                    <MapPin className="w-5 h-5 text-[#f7941d] group-hover/item:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-800 text-sm uppercase tracking-wider mb-1">Our Store Location</h4>
                    <p className="text-gray-600 font-medium">Patna, Bihar, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-5 group/item">
                  <div className="w-12 h-12 bg-[#fffbf4] border border-orange-100 rounded-sm flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#f7941d] group-hover/item:border-[#f7941d] transition-colors duration-300 transform group-hover/item:-translate-y-1">
                    <Phone className="w-5 h-5 text-[#f7941d] group-hover/item:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-800 text-sm uppercase tracking-wider mb-1">Phone Number</h4>
                    <a href="tel:+919123187724" className="text-gray-600 font-medium hover:text-[#f7941d] transition-colors">+91 91231 87724</a>
                  </div>
                </div>

                <div className="flex items-start gap-5 group/item">
                  <div className="w-12 h-12 bg-[#fffbf4] border border-orange-100 rounded-sm flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#f7941d] group-hover/item:border-[#f7941d] transition-colors duration-300 transform group-hover/item:-translate-y-1">
                    <Mail className="w-5 h-5 text-[#f7941d] group-hover/item:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-800 text-sm uppercase tracking-wider mb-1">Customer Care</h4>
                    <a href="mailto:aarpancart@gmail.com" className="text-gray-600 font-medium hover:text-[#f7941d] transition-colors break-all">aarpancart@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-5 group/item pt-6 border-t border-gray-100">
                  <div className="w-12 h-12 bg-[#fffbf4] border border-orange-100 rounded-sm flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#8b1818] group-hover/item:border-[#8b1818] transition-colors duration-300 transform group-hover/item:-translate-y-1">
                    <Clock className="w-5 h-5 text-[#f7941d] group-hover/item:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-800 text-sm uppercase tracking-wider mb-1">Business Hours</h4>
                    <p className="text-gray-600 font-medium">Mon - Sat: 9:00 AM - 8:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* =========================================
              RIGHT SIDE: CONTACT FORM
          ========================================= */}
          <div className="lg:w-2/3 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="bg-white p-8 md:p-12 rounded-sm shadow-sm border border-orange-50 relative">
              <h3 className="text-2xl font-extrabold text-gray-800 mb-8 uppercase tracking-wide">Send us a Message</h3>
              
              {status.success && (
                <div className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm rounded-sm flex flex-col items-center justify-center text-center p-8 border border-green-100">
                  <CheckCircle className="w-20 h-20 text-green-500 mb-4 animate-bounce" />
                  <h4 className="text-2xl font-extrabold text-gray-800 mb-2 uppercase tracking-wide">Message Sent!</h4>
                  <p className="text-gray-600 font-medium">Thank you for reaching out. Our team will get back to you shortly.</p>
                </div>
              )}

              {status.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-sm flex items-center gap-3 mb-8 shadow-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="font-bold text-sm uppercase tracking-wider">{status.error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-2">Your Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Amit Virat"
                      className="w-full px-4 py-3 border border-orange-100 rounded-sm outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] bg-[#fcfaf5] focus:bg-white transition-all text-sm font-medium text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="amit@example.com"
                      className="w-full px-4 py-3 border border-orange-100 rounded-sm outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] bg-[#fcfaf5] focus:bg-white transition-all text-sm font-medium text-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-2">Subject</label>
                  <input 
                    type="text" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Bulk Order Inquiry"
                    className="w-full px-4 py-3 border border-orange-100 rounded-sm outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] bg-[#fcfaf5] focus:bg-white transition-all text-sm font-medium text-gray-800"
                  />
                </div>

                <div className="mb-8">
                  <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-2">Message</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="How can we help you today?"
                    className="w-full px-4 py-3 border border-orange-100 rounded-sm outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] bg-[#fcfaf5] focus:bg-white transition-all resize-none text-sm font-medium text-gray-800"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={status.loading}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-[#8b1818] to-[#6e1313] hover:from-[#f7941d] hover:to-[#e0861a] text-white font-extrabold text-sm py-4 px-12 rounded-sm shadow-md transition-all duration-300 hover:shadow-[0_10px_20px_rgba(139,24,24,0.2)] active:scale-95 disabled:opacity-70 uppercase tracking-widest"
                >
                  {status.loading ? 'Sending...' : 'Send Message'}
                  {!status.loading && <Send className="w-4 h-4" />}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;