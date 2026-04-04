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

  // Loading, Success, aur Error teeno state handle karenge
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    try {
      // 🚨 REAL BACKEND API CALL 🚨
      // Make sure tumhare backend me POST /api/contact route bana hua hai
      const response = await axios.post('https://arpancart.onrender.com/api/contact', formData);

      if (response.data.success || response.status === 200 || response.status === 201) {
        setStatus({ loading: false, success: true, error: null });
        setFormData({ name: '', email: '', subject: '', message: '' }); // Form clear
        
        // 4 second baad success message hata do
        setTimeout(() => setStatus({ loading: false, success: false, error: null }), 4000);
      }
    } catch (err) {
      console.error("Contact Form Error:", err);
      setStatus({ 
        loading: false, 
        success: false, 
        error: err.response?.data?.message || "Failed to send message. Please try again later." 
      });
      
      // 4 second baad error message hata do
      setTimeout(() => setStatus(prev => ({ ...prev, error: null })), 4000);
    }
  };

  return (
    <div className="bg-[#fcfaf5] min-h-screen py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* =========================================
            HEADER SECTION (Premium Decor)
        ========================================= */}
        <div className="text-center mb-16 mt-4">
          <div className="flex items-center justify-center mb-6">
            <div className="hidden md:flex items-center">
              <div className="w-12 lg:w-24 h-[1px] bg-[#8b1818] opacity-40"></div>
              <div className="w-1.5 h-1.5 bg-[#8b1818] transform rotate-45 mx-1.5 opacity-60"></div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#8b1818] px-6 text-center tracking-wide uppercase">
              Get In Touch
            </h1>

            <div className="hidden md:flex items-center">
              <div className="w-1.5 h-1.5 bg-[#8b1818] transform rotate-45 mx-1.5 opacity-60"></div>
              <div className="w-12 lg:w-24 h-[1px] bg-[#8b1818] opacity-40"></div>
            </div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-center font-medium text-lg">
            Have questions about our pooja samagri, bulk orders, or subscriptions? We are here to help you on your spiritual journey.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 max-w-6xl mx-auto">
          
          {/* =========================================
              LEFT SIDE: CONTACT INFORMATION
          ========================================= */}
          <div className="lg:w-1/3 space-y-8">
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-orange-50 h-full">
              <h3 className="text-2xl font-bold text-[#8b1818] mb-8">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#f7941d] transition-colors duration-300">
                    <MapPin className="w-5 h-5 text-[#f7941d] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg mb-1">Our Store Location</h4>
                    <p className="text-gray-600 leading-relaxed">Patna, Bihar, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#f7941d] transition-colors duration-300">
                    <Phone className="w-5 h-5 text-[#f7941d] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg mb-1">Phone Number</h4>
                    <a href="tel:+919123187724" className="text-gray-600 hover:text-[#f7941d] transition-colors">+91 91231 87724</a>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#f7941d] transition-colors duration-300">
                    <Mail className="w-5 h-5 text-[#f7941d] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg mb-1">Customer Care</h4>
                    <a href="mailto:aarpancart@gmail.com" className="text-gray-600 hover:text-[#f7941d] transition-colors break-all">aarpancart@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-4 group pt-4 border-t border-gray-100">
                  <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#f7941d] transition-colors duration-300">
                    <Clock className="w-5 h-5 text-[#f7941d] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg mb-1">Business Hours</h4>
                    <p className="text-gray-600">Monday - Saturday:<br />9:00 AM - 8:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* =========================================
              RIGHT SIDE: CONTACT FORM
          ========================================= */}
          <div className="lg:w-2/3">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-orange-50 relative">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h3>
              
              {status.success && (
                <div className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-center p-8 border border-green-100">
                  <CheckCircle className="w-20 h-20 text-green-500 mb-4 animate-bounce" />
                  <h4 className="text-2xl font-bold text-gray-800 mb-2">Message Sent!</h4>
                  <p className="text-gray-600 font-medium">Thank you for reaching out. Our team will get back to you shortly.</p>
                </div>
              )}

              {status.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-center gap-3 mb-6">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="font-bold text-sm">{status.error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Amit Virat"
                      className="w-full px-4 py-3 border border-gray-200 rounded-md outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] bg-gray-50 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="amit@example.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-md outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] bg-gray-50 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                  <input 
                    type="text" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Bulk Order Inquiry"
                    className="w-full px-4 py-3 border border-gray-200 rounded-md outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] bg-gray-50 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="How can we help you today?"
                    className="w-full px-4 py-3 border border-gray-200 rounded-md outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] bg-gray-50 focus:bg-white transition-all resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={status.loading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#f7941d] hover:bg-[#e0861a] text-white font-bold text-lg py-3.5 px-10 rounded-md shadow-md transition-all duration-300 hover:shadow-lg active:scale-95 disabled:opacity-70"
                >
                  {status.loading ? 'Sending...' : 'Send Message'}
                  {!status.loading && <Send className="w-5 h-5" />}
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