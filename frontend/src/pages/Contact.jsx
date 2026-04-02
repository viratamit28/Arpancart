import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState({ loading: false, success: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false });

    // Yahan backend API call aayegi (abhi ke liye fake delay lagaya hai)
    setTimeout(() => {
      setStatus({ loading: false, success: true });
      setFormData({ name: '', email: '', subject: '', message: '' }); // Form clear
      
      // 3 second baad success message hata do
      setTimeout(() => setStatus({ loading: false, success: false }), 3000);
    }, 1500);
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
                    <p className="text-gray-600 leading-relaxed">Hinjewadi Phase 1,<br />Pune, Maharashtra 411057</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#f7941d] transition-colors duration-300">
                    <Phone className="w-5 h-5 text-[#f7941d] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg mb-1">Phone Number</h4>
                    <a href="tel:+919876543210" className="text-gray-600 hover:text-[#f7941d] transition-colors">+91 98765 43210</a>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#f7941d] transition-colors duration-300">
                    <Mail className="w-5 h-5 text-[#f7941d] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg mb-1">Email Address</h4>
                    <a href="mailto:support@poojastore.com" className="text-gray-600 hover:text-[#f7941d] transition-colors">support@poojastore.com</a>
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
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-orange-50">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h3>
              
              {status.success ? (
                <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-lg flex flex-col items-center justify-center text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                  <h4 className="text-xl font-bold mb-2">Message Sent Successfully!</h4>
                  <p>Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                </div>
              ) : (
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
                        placeholder="Amit Virat"
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
                    className="flex items-center justify-center gap-2 bg-[#f7941d] hover:bg-[#e0861a] text-white font-bold text-lg py-4 px-8 rounded-md shadow-md transition-all duration-300 hover:shadow-lg active:scale-95 disabled:opacity-70"
                  >
                    {status.loading ? 'Sending...' : 'Send Message'}
                    {!status.loading && <Send className="w-5 h-5" />}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;