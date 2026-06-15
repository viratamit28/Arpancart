import React, { useContext, useState, useEffect } from 'react';
import { Search, ShoppingCart, User, LogOut, Phone, Mail, Menu, X, CheckCircle, MessageCircle, CalendarClock } from 'lucide-react'; 
import logo from '../assets/logo.png'; 
import { CartContext } from '../context/CartContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const { cartCount, showCartIndicator } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token'); 
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [whatsappNumber, setWhatsappNumber] = useState('910000000000'); 

  const API_BASE_URL = 'https://arpancart-production.up.railway.app/api';

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/public-settings`);
        if (res.data.success && res.data.data.whatsappNumber) {
          setWhatsappNumber(res.data.data.whatsappNumber);
        }
      } catch (error) {
        console.error("Error fetching settings for Navbar", error);
      }
    };
    fetchSettings();
  }, []);

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
      setIsMobileSearchOpen(false); 
    }
  };

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) setIsMobileSearchOpen(false);
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
    if (!isMobileSearchOpen) setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 shadow-sm w-full bg-white border-b border-gray-100">
      
      {/* =========================================
          TOP CONTACT BAR (DESKTOP ONLY)
      ========================================= */}
      <div className="hidden md:flex bg-[#8b1818] text-white py-1.5 px-4 md:px-8 text-xs font-medium justify-between items-center">
        <div className="flex gap-6">
          <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> +91 91231 87724</span>
          <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> aarpancart@gmail.com</span>
        </div>
        <div>
          <span>Free Shipping on Orders above ₹499 | 100% Authentic Samagri</span>
        </div>
      </div>

      <div>
        {/* =========================================
            MAIN HEADER ROW (EXACTLY LIKE IMAGE)
        ========================================= */}
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex justify-between items-center bg-white z-20 relative">
          
          {/* Left Side: Logo & Tagline */}
          <Link to="/" className="flex flex-col items-start" onClick={() => { setIsMobileMenuOpen(false); setIsMobileSearchOpen(false); }}>
            <img src={logo} alt="PujaDukaan Logo" className="h-8 md:h-12 w-auto object-contain" />
            
          </Link>

          {/* Desktop Search Bar (Hidden on Mobile) */}
          <div className="hidden md:flex flex-grow max-w-xl mx-8 items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="flex-grow flex items-center bg-white border border-gray-300 rounded-sm px-3 py-1.5 focus-within:border-[#8b1818] transition-all">
              <input 
                type="text" 
                placeholder="Search Pooja Samagri..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full outline-none text-sm bg-transparent text-gray-700 placeholder-gray-400" 
              />
              <button type="submit" className="text-gray-500 hover:text-[#8b1818] transition-colors ml-2">
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Right Side: Cart, WhatsApp, Menu (Exact order as image) */}
          <div className="flex items-center gap-4 md:gap-6">
            
            {/* 1. Shopping Bag with Badge */}
            <div className="relative">
              <Link to="/cart" className="relative text-gray-800 hover:text-[#8b1818] transition-colors block">
                {/* Changed to ShoppingBag-like icon from lucide, using ShoppingCart for now, adjust if needed */}
                <ShoppingCart className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
                <span className="absolute -top-1.5 -right-2 bg-[#d32f2f] text-white text-[11px] font-bold h-[18px] min-w-[18px] px-1 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              </Link>
              
              {/* Cart Addition Success Tooltip */}
              {showCartIndicator && (
                <div className="absolute top-full right-0 mt-4 w-48 bg-white border border-orange-100 shadow-lg rounded-sm p-3 z-50 animate-fade-in-up">
                  <div className="absolute -top-2 right-1.5 w-4 h-4 bg-white border-t border-l border-orange-100 transform rotate-45"></div>
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mb-1" />
                    <p className="text-xs font-bold text-gray-800">Item Added!</p>
                  </div>
                </div>
              )}
            </div>

            {/* 2. WhatsApp Icon */}
            <a 
              href={`https://wa.me/${whatsappNumber}?text=Hare%20Krishna!%20Mujhe%20pooja%20samagri%20ki%20jankari%20chahiye:`}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-800 hover:text-[#25D366] transition-colors block"
            >
              <MessageCircle className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
            </a>

            {/* User Icon (Desktop Only) */}
            <Link to={token ? "/dashboard" : "/login"} className="hidden md:block text-gray-800 hover:text-[#8b1818] transition-colors">
              <User className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
            </Link>

            {/* 3. Hamburger Menu (Mobile Only) */}
            <button 
              className="md:hidden text-gray-800 p-1" 
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X className="w-7 h-7" strokeWidth={1.5} /> : <Menu className="w-7 h-7" strokeWidth={1.5} />}
            </button>

          </div>
        </div>

        {/* Desktop Navigation Links (Below Header) */}
        <div className="hidden md:flex border-t border-gray-200 bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-8 py-2.5 flex gap-8 text-[14px] font-semibold text-gray-700 tracking-wide">
            <Link to="/" className={`${isActive('/') ? 'text-[#8b1818]' : 'hover:text-[#8b1818]'}`}>Home</Link>
            <Link to="/shop" className={`${isActive('/shop') ? 'text-[#8b1818]' : 'hover:text-[#8b1818]'}`}>Shop</Link>
            <Link to="/subscriptions" className={`${isActive('/subscriptions') ? 'text-[#8b1818]' : 'hover:text-[#8b1818]'}`}>Subscriptions</Link>
            <Link to="/about" className={`${isActive('/about') ? 'text-[#8b1818]' : 'hover:text-[#8b1818]'}`}>About Us</Link>
            <Link to="/contact" className={`${isActive('/contact') ? 'text-[#8b1818]' : 'hover:text-[#8b1818]'}`}>Contact</Link>
          </div>
        </div>

        {/* =========================================
            MOBILE DROPDOWN MENU
        ========================================= */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 flex flex-col z-40">
            {/* Search Bar Inside Mobile Menu */}
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <form onSubmit={handleSearchSubmit} className="flex items-center bg-white border border-gray-300 rounded-sm px-3 py-2">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="w-full outline-none text-sm bg-transparent" 
                />
                <button type="submit" className="text-gray-500 ml-2">
                  <Search className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col py-2 font-semibold text-gray-700 text-[15px]">
              <Link to="/" className={`px-6 py-3 border-b border-gray-50 ${isActive('/') ? 'text-[#8b1818] bg-red-50' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link to="/shop" className={`px-6 py-3 border-b border-gray-50 ${isActive('/shop') ? 'text-[#8b1818] bg-red-50' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
              <Link to="/subscriptions" className={`px-6 py-3 border-b border-gray-50 ${isActive('/subscriptions') ? 'text-[#8b1818] bg-red-50' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Subscriptions</Link>
              <Link to="/about" className={`px-6 py-3 border-b border-gray-50 ${isActive('/about') ? 'text-[#8b1818] bg-red-50' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
              <Link to="/contact" className={`px-6 py-3 border-b border-gray-50 ${isActive('/contact') ? 'text-[#8b1818] bg-red-50' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
              
              {token && (
                <Link to="/dashboard" className={`px-6 py-3 border-b border-gray-50 ${isActive('/dashboard') ? 'text-[#8b1818] bg-red-50' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>My Dashboard</Link>
              )}
            </div>

            {/* Auth Buttons */}
            <div className="p-4 bg-gray-50 flex gap-2">
              <a href={`https://wa.me/${whatsappNumber}?text=Pranam!%20Mujhe%20Pandit%20Ji%20book%20karne%20ke%20liye%20enquiry%20karni%20hai.`} target="_blank" rel="noopener noreferrer" className="flex-1 flex justify-center items-center gap-1 bg-[#f7941d] text-white py-2 rounded-sm text-xs font-bold shadow-sm">
                <CalendarClock className="w-3.5 h-3.5" /> Book Pandit
              </a>
              {token ? (
                <button onClick={handleLogout} className="flex-1 flex justify-center items-center gap-1 border border-[#8b1818] text-[#8b1818] py-2 rounded-sm text-xs font-bold bg-white">
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              ) : (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 flex justify-center items-center bg-[#8b1818] text-white py-2 rounded-sm text-xs font-bold">
                  Login / Sign Up
                </Link>
              )}
            </div>
          </div>
        )}
        
      </div>
    </header>
  );
};

export default Navbar;