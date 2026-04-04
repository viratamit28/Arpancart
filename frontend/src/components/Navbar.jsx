import React, { useContext, useState } from 'react';
import { Search, ShoppingCart, User, LogOut, Phone, Mail, Menu, X } from 'lucide-react'; 
import logo from '../assets/logo.png'; 
import { CartContext } from '../context/CartContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token'); 
  
  // State for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // State for search input
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login'); 
    setIsMobileMenuOpen(false); // Close menu on logout
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to shop page with search query parameter
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(''); // Clear input
      setIsMobileMenuOpen(false); // Close menu if open
    }
  };

  // Helper to check if link is active
  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 shadow-sm w-full">
      
      {/* =========================================
          TOP BAR 
      ========================================= */}
      <div className="bg-[#8b1818] text-white py-1.5 px-4 md:px-8 text-xs font-medium flex justify-between items-center hidden md:flex">
        <div className="flex gap-6">
          <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> +91 91231 87724</span>
          <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> arpancart@gmail.com</span>
        </div>
        <div>
          <span>Free Shipping on Orders above ₹999 | 100% Authentic Samagri</span>
        </div>
      </div>

      <div className="bg-[#fcfaf5]">
        
        {/* =========================================
            ROW 1: LOGO, SEARCH, ICONS
        ========================================= */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center gap-4 border-b border-[#8b1818]/10 md:border-none">
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-[#8b1818]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
            <img src={logo} alt="Arpan Cart Logo" className="h-10 md:h-14 w-auto object-contain" />
          </Link>

          {/* Desktop Search Bar */}
          <form 
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-grow max-w-xl mx-4 items-center bg-white border border-orange-200 rounded-md px-3 py-2 focus-within:border-[#f7941d] focus-within:ring-1 focus-within:ring-[#f7941d] transition-all shadow-sm"
          >
            <input 
              type="text" 
              placeholder="Search Pooja Samagri..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full outline-none text-sm bg-transparent text-gray-700 placeholder-gray-400" 
            />
            <button type="submit" className="text-[#8b1818] hover:text-[#f7941d] transition-colors ml-2 focus:outline-none">
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* Right Side Icons & Auth Button */}
          <div className="flex items-center gap-5 md:gap-6">
            
            <Link to={token ? "/dashboard" : "/login"} className="text-[#8b1818] hover:text-[#f7941d] transition-colors">
              <User className="w-6 h-6" />
            </Link>
            
            <Link to="/cart" className="relative text-[#8b1818] hover:text-[#f7941d] transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#f7941d] text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Desktop Auth Button */}
            {token ? (
              <button 
                onClick={handleLogout} 
                className="hidden md:flex items-center gap-2 bg-[#8b1818] hover:bg-[#6e1313] text-white px-5 py-2.5 rounded shadow-md font-bold text-sm transition-all duration-300 active:scale-95"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            ) : (
              <Link 
                to="/login" 
                className="hidden md:flex bg-[#f7941d] hover:bg-[#e0861a] text-white px-6 py-2.5 rounded shadow-md font-bold text-sm transition-all duration-300 active:scale-95"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* =========================================
            MOBILE MENU (Conditional Rendering)
        ========================================= */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#fcfaf5] border-t border-[#8b1818]/10 px-4 py-4 space-y-4">
             {/* Mobile Search */}
             <form 
              onSubmit={handleSearchSubmit}
              className="flex items-center bg-white border border-orange-200 rounded-md px-3 py-2 mb-4"
            >
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full outline-none text-sm bg-transparent text-gray-700" 
              />
              <button type="submit" className="text-[#8b1818] ml-2">
                <Search className="w-5 h-5" />
              </button>
            </form>

            <div className="flex flex-col gap-3 font-bold text-gray-700 uppercase tracking-wide text-sm">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={`${isActive('/') ? 'text-[#c21820]' : 'hover:text-[#c21820]'}`}>Home</Link>
              <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className={`${isActive('/shop') ? 'text-[#c21820]' : 'hover:text-[#c21820]'}`}>Shop</Link>
              <Link to="/subscriptions" onClick={() => setIsMobileMenuOpen(false)} className={`${isActive('/subscriptions') ? 'text-[#c21820]' : 'hover:text-[#c21820]'}`}>Subscriptions</Link>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className={`${isActive('/about') ? 'text-[#c21820]' : 'hover:text-[#c21820]'}`}>About Us</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className={`${isActive('/contact') ? 'text-[#c21820]' : 'hover:text-[#c21820]'}`}>Contact</Link>
            </div>
            
             {/* Mobile Auth Button */}
             <div className="pt-4 border-t border-[#8b1818]/10">
              {token ? (
                <button 
                  onClick={handleLogout} 
                  className="w-full flex items-center justify-center gap-2 bg-[#8b1818] text-white px-5 py-2.5 rounded font-bold text-sm"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              ) : (
                <Link 
                  to="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex justify-center bg-[#f7941d] text-white px-6 py-2.5 rounded font-bold text-sm"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}

        {/* =========================================
            ROW 2: DESKTOP NAVIGATION LINKS 
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