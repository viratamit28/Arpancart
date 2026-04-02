import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ChevronRight, Heart } from 'lucide-react';

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
                <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-[#f7941d] transition-all duration-300 group">
                  <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  My Subscriptions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Customer Service */}
          <div>
            <h3 className="text-[#8b1818] font-bold text-lg mb-6">Customer Service</h3>
            <ul className="space-y-3">
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
                <Link to="/faq" className="flex items-center text-gray-600 hover:text-[#f7941d] transition-all duration-300 group">
                  <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  FAQs
                </Link>
              </li>
            </ul>
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

          {/* Column 4: Contact Us */}
          <div>
            <h3 className="text-[#8b1818] font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start text-gray-600">
                <Mail className="w-5 h-5 mr-3 text-[#f7941d] flex-shrink-0 mt-0.5" />
                <a href="mailto:support@poojastore.com" className="hover:text-[#f7941d] transition-colors">
                  support@poojastore.com
                </a>
              </li>
              <li className="flex items-start text-gray-600">
                <Phone className="w-5 h-5 mr-3 text-[#f7941d] flex-shrink-0 mt-0.5" />
                <a href="tel:+919876543210" className="hover:text-[#f7941d] transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-start text-gray-600">
                <MapPin className="w-5 h-5 mr-3 text-[#f7941d] flex-shrink-0 mt-0.5" />
                <span>Hinjewadi Phase 1, Pune, Maharashtra 411057</span>
              </li>
            </ul>
          </div>

        </div>

        {/* =========================================
            BOTTOM COPYRIGHT BAR
        ========================================= */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 text-center md:text-left">
            © {new Date().getFullYear()} Pooja Store. All Rights Reserved.
          </p>
          <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> by a Panda Outsourcing
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;