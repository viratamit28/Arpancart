import React, { useContext, useState } from 'react';
import { Search, ShoppingCart, User, LogOut, Phone, Mail, Menu, X, CheckCircle } from 'lucide-react'; 
import logo from '../assets/logo.png'; 
import { CartContext } from '../context/CartContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  // 🚨 Context se showCartIndicator bhi nikalo
  const { cartCount, showCartIndicator } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token'); 
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login'); 
    setIsMobileMenuOpen(false); 
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(''); 
      setIsMobileMenuOpen(false); 
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 shadow-sm w-full">
      
      {/* TOP BAR */}
      <div className="bg-[#8b1818] text-white py-1.5 px-4 md:px-8 text-xs font-medium flex justify-between items-center hidden md:flex">
        <div className="flex gap-6">
          <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> +91 91231 87724</span>
          <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> aarpancart@gmail.com</span>
        </div>
        <div>
          <span>Free Shipping on Orders above ₹999 | 100% Authentic Samagri</span>
        </div>
      </div>

      <div className="bg-[#fcfaf5]">
        
        {/* ROW 1: LOGO, SEARCH, ICONS */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center gap-4 border-b border-[#8b1818]/10 md:border-none">
          
          <button className="md:hidden text-[#8b1818]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link to="/" className="flex-shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
            <img src={logo} alt="Arpan Cart Logo" className="h-10 md:h-14 w-auto object-contain" />
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-grow max-w-xl mx-4 items-center bg-white border border-orange-200 rounded-sm px-3 py-2 focus-within:border-[#f7941d] transition-all shadow-sm">
            <input type="text" placeholder="Search Pooja Samagri..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full outline-none text-sm bg-transparent text-gray-700 placeholder-gray-400" />
            <button type="submit" className="text-[#8b1818] hover:text-[#f7941d] transition-colors ml-2"><Search className="w-5 h-5" /></button>
          </form>

          {/* Right Side Icons & Auth */}
          <div className="flex items-center gap-5 md:gap-6">
            <Link to={token ? "/dashboard" : "/login"} className="text-[#8b1818] hover:text-[#f7941d] transition-colors">
              <User className="w-6 h-6" />
            </Link>
            
            {/* 🚨 CART ICON WITH TOOLTIP WRAPPER 🚨 */}
            <div className="relative">
              <Link to="/cart" className="relative text-[#8b1818] hover:text-[#f7941d] transition-colors block">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#f7941d] text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* ✨ MAGIC TOOLTIP HERE ✨ */}
              {showCartIndicator && (
                <div className="absolute top-full right-0 mt-4 w-48 bg-white border border-orange-100 shadow-[0_10px_25px_rgba(139,24,24,0.15)] rounded-sm p-3 z-50 animate-fade-in-up">
                  {/* Tooltip ka upar point karne wala teer (Arrow) */}
                  <div className="absolute -top-2 right-1.5 w-4 h-4 bg-white border-t border-l border-orange-100 transform rotate-45"></div>
                  
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mb-1" />
                    <p className="text-xs font-bold text-gray-800">Item Added!</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Click cart icon to checkout</p>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Auth Button */}
            {token ? (
              <button onClick={handleLogout} className="hidden md:flex items-center gap-2 border-[2px] border-[#8b1818] text-[#8b1818] hover:bg-[#8b1818] hover:text-white px-5 py-2 rounded-sm font-bold text-sm transition-all duration-300">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            ) : (
              <Link to="/login" className="hidden md:flex bg-[#f7941d] hover:bg-[#e0861a] text-white px-6 py-2.5 rounded-sm shadow-md font-bold text-sm transition-all duration-300">
                Login
              </Link>
            )}
          </div>
        </div>

        {/* ... (Baaki Mobile Menu aur Desktop Links waisa hi rahega) ... */}
        {/* ROW 2: DESKTOP NAVIGATION LINKS */}
        <div className="hidden md:flex border-t border-[#8b1818]/10 bg-[#fcfaf5]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex gap-8 text-[15px] font-bold text-gray-700 uppercase tracking-wide">
            <Link to="/" className={`${isActive('/') ? 'text-[#c21820]' : 'hover:text-[#c21820]'} transition-colors`}>Home</Link>
            <Link to="/shop" className={`${isActive('/shop') ? 'text-[#c21820]' : 'hover:text-[#c21820]'} transition-colors`}>Shop</Link>
            <Link to="/subscriptions" className={`${isActive('/subscriptions') ? 'text-[#c21820]' : 'hover:text-[#c21820]'} transition-colors`}>Subscriptions</Link>
            <Link to="/about" className={`${isActive('/about') ? 'text-[#c21820]' : 'hover:text-[#c21820]'} transition-colors`}>About Us</Link>
            <Link to="/contact" className={`${isActive('/contact') ? 'text-[#c21820]' : 'hover:text-[#c21820]'} transition-colors`}>Contact</Link>
          </div>
        </div>
        
      </div>
    </header>
  );
};

export default Navbar;