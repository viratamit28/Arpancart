import React, { useContext, useState } from 'react';
import { Search, ShoppingCart, User, LogOut, Phone, Mail, Menu, X, CheckCircle } from 'lucide-react'; 
import logo from '../assets/logo.png'; 
import { CartContext } from '../context/CartContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
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
    <header className="sticky top-0 z-50 shadow-sm w-full bg-[#fcfaf5]">
      
      {/* =========================================
          TOP CONTACT BAR (DESKTOP ONLY)
      ========================================= */}
      <div className="hidden md:flex bg-[#8b1818] text-white py-1.5 px-4 md:px-8 text-xs font-medium justify-between items-center">
        <div className="flex gap-6">
          <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> +91 91231 87724</span>
          <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> aarpancart@gmail.com</span>
        </div>
        <div>
          <span>Free Shipping on Orders above ₹999 | 100% Authentic Samagri</span>
        </div>
      </div>

      <div>
        {/* =========================================
            MAIN HEADER ROW (LOGO, SEARCH, ICONS)
        ========================================= */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center gap-4 border-b border-[#8b1818]/10 md:border-none relative">
          
          {/* Mobile Menu Toggle Button */}
          <button 
            className="md:hidden text-[#8b1818] hover:bg-orange-50 p-1 rounded transition-colors" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 mx-auto md:mx-0" onClick={() => setIsMobileMenuOpen(false)}>
            <img src={logo} alt="Arpan Cart Logo" className="h-10 md:h-14 w-auto object-contain" />
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-grow max-w-xl mx-4 items-center bg-white border border-orange-200 rounded-sm px-3 py-2 focus-within:border-[#f7941d] transition-all shadow-sm">
            <input 
              type="text" 
              placeholder="Search Pooja Samagri..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full outline-none text-sm bg-transparent text-gray-700 placeholder-gray-400" 
            />
            <button type="submit" className="text-[#8b1818] hover:text-[#f7941d] transition-colors ml-2">
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* Right Side Icons (User & Cart) */}
          <div className="flex items-center gap-4 md:gap-6">
            <Link to={token ? "/dashboard" : "/login"} className="text-[#8b1818] hover:text-[#f7941d] transition-colors">
              <User className="w-6 h-6" />
            </Link>
            
            {/* Cart Icon with Indicator */}
            <div className="relative">
              <Link to="/cart" className="relative text-[#8b1818] hover:text-[#f7941d] transition-colors block">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#f7941d] text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Cart Addition Success Tooltip */}
              {showCartIndicator && (
                <div className="absolute top-full right-0 mt-4 w-48 bg-white border border-orange-100 shadow-[0_10px_25px_rgba(139,24,24,0.15)] rounded-sm p-3 z-50 animate-fade-in-up">
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

        {/* =========================================
            MOBILE DROPDOWN MENU
        ========================================= */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-b border-gray-100 flex flex-col z-40 animate-fade-in-down">
            
            {/* Mobile Search Bar */}
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <form onSubmit={handleSearchSubmit} className="flex items-center bg-white border border-gray-200 rounded px-3 py-2 shadow-sm focus-within:border-[#f7941d]">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="w-full outline-none text-sm bg-transparent" 
                />
                <button type="submit" className="text-[#8b1818] ml-2"><Search className="w-4 h-4" /></button>
              </form>
            </div>

            {/* Mobile Navigation Links */}
            <div className="flex flex-col py-2 font-bold text-gray-700 uppercase tracking-wide text-sm">
              <Link to="/" className={`px-6 py-3 border-b border-gray-50 ${isActive('/') ? 'text-[#c21820] bg-orange-50' : 'hover:bg-gray-50'}`} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link to="/shop" className={`px-6 py-3 border-b border-gray-50 ${isActive('/shop') ? 'text-[#c21820] bg-orange-50' : 'hover:bg-gray-50'}`} onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
              <Link to="/subscriptions" className={`px-6 py-3 border-b border-gray-50 ${isActive('/subscriptions') ? 'text-[#c21820] bg-orange-50' : 'hover:bg-gray-50'}`} onClick={() => setIsMobileMenuOpen(false)}>Subscriptions</Link>
              <Link to="/about" className={`px-6 py-3 border-b border-gray-50 ${isActive('/about') ? 'text-[#c21820] bg-orange-50' : 'hover:bg-gray-50'}`} onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
              <Link to="/contact" className={`px-6 py-3 border-b border-gray-50 ${isActive('/contact') ? 'text-[#c21820] bg-orange-50' : 'hover:bg-gray-50'}`} onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            </div>

            {/* Mobile Auth Button */}
            <div className="p-4 bg-gray-50">
              {token ? (
                <button onClick={handleLogout} className="w-full flex justify-center items-center gap-2 border-[2px] border-[#8b1818] text-[#8b1818] py-2.5 rounded-sm font-bold active:bg-gray-100">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              ) : (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex justify-center bg-[#f7941d] text-white py-2.5 rounded-sm shadow-md font-bold active:scale-95 transition-transform">
                  Login / Sign Up
                </Link>
              )}
            </div>
          </div>
        )}

        {/* =========================================
            DESKTOP NAVIGATION LINKS
        ========================================= */}
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