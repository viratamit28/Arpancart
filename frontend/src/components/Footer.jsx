import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ChevronRight, Heart, HeadphonesIcon } from 'lucide-react';

const Footer = () => {
  return (
    // Background cream rakha hai blueprint matching ke liye, with a subtle top border
    <footer className="bg-[#fcfaf5] border-t-2 border-[#8b1818]/10 pt-16 pb-8 mt-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* =========================================
            FOOTER GRID (4 Columns)
        ========================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          
          {/* Column 1: Quick Links */}
          <div>
            <h3 className="text-[#8b1818] font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="flex items-center text-gray-600 hover:text-[#f7941d] transition-all duration-300 group">
                  <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="flex items-center text-gray-600 hover:text-[#f7941d] transition-all duration-300 group">
                  <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Shop Pooja Samagri
                </Link>
              </li>
              <li>
                <Link to="/about" className="flex items-center text-gray-600 hover:text-[#f7941d] transition-all duration-300 group">
                  <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/subscriptions" className="flex items-center text-gray-600 hover:text-[#f7941d] transition-all duration-300 group">
                  <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Monthly Subscriptions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Customer Service & Social */}
          <div>
            <h3 className="text-[#8b1818] font-bold text-lg mb-6">Customer Service</h3>
            <ul className="space-y-3 mb-6">
              <li>
                <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-[#f7941d] transition-all duration-300 group">
                  <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="flex items-center text-gray-600 hover:text-[#f7941d] transition-all duration-300 group">
                  <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/contact" className="flex items-center text-gray-600 hover:text-[#f7941d] transition-all duration-300 group">
                  <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Contact Us
                </Link>
              </li>
            </ul>

            {/* Social Media Links (DIRECT SVGs used to bypass import errors) */}
            <h3 className="text-[#8b1818] font-bold text-lg mb-4 mt-6">Connect With Us</h3>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/arpancart?utm_source=qr&igsh=OW94NWFhdzBocHd3" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-[#f7941d] hover:bg-[#f7941d] hover:text-white transition-colors duration-300 shadow-sm"
              >
                {/* Instagram Native SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
              <a 
                href="https://www.facebook.com/share/1AAV454boP/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-[#f7941d] hover:bg-[#f7941d] hover:text-white transition-colors duration-300 shadow-sm"
              >
                {/* Facebook Native SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 3: Policies */}
          <div>
            <h3 className="text-[#8b1818] font-bold text-lg mb-6">Policies</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="flex items-center text-gray-600 hover:text-[#f7941d] transition-all duration-300 group">
                  <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="flex items-center text-gray-600 hover:text-[#f7941d] transition-all duration-300 group">
                  <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/return" className="flex items-center text-gray-600 hover:text-[#f7941d] transition-all duration-300 group">
                  <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Return & Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div>
            <h3 className="text-[#8b1818] font-bold text-lg mb-6">Contact Info</h3>
            <ul className="space-y-4">
              
              {/* Phone */}
              <li className="flex items-start text-gray-600">
                <Phone className="w-5 h-5 mr-3 text-[#f7941d] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Call Us</p>
                  <a href="tel:+919123187724" className="hover:text-[#f7941d] transition-colors font-medium">
                    +91 91231 87724
                  </a>
                </div>
              </li>

              {/* Customer Care Email */}
              <li className="flex items-start text-gray-600">
                <HeadphonesIcon className="w-5 h-5 mr-3 text-[#f7941d] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Customer Care</p>
                  <a href="mailto:arpancart@gmail.com" className="hover:text-[#f7941d] transition-colors font-medium break-all">
                    arpancart@gmail.com
                  </a>
                </div>
              </li>

              {/* Office Email */}
              <li className="flex items-start text-gray-600">
                <Mail className="w-5 h-5 mr-3 text-[#f7941d] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Office Work</p>
                  <a href="mailto:arpancartofficial@gmail.com" className="hover:text-[#f7941d] transition-colors font-medium break-all">
                    arpancartofficial@gmail.com
                  </a>
                </div>
              </li>

              {/* Location */}
              <li className="flex items-start text-gray-600">
                <MapPin className="w-5 h-5 mr-3 text-[#f7941d] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Location</p>
                  <span className="font-medium">Patna, Bihar, India</span>
                </div>
              </li>

            </ul>
          </div>

        </div>

        {/* =========================================
            BOTTOM COPYRIGHT BAR
        ========================================= */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 text-center md:text-left font-medium">
            © {new Date().getFullYear()} Arpan Cart. All Rights Reserved.
          </p>
          <p className="text-sm text-gray-500 flex items-center justify-center gap-1 font-medium">
            Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> by Ryax  Digital Technologies
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;