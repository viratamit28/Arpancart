import React, { useContext } from 'react';
import { Search, ShoppingCart, User, LogOut, Phone, Mail } from 'lucide-react'; 
import logo from '../assets/logo.png'; 
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); 

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login'); 
  };

  return (
    <header className="sticky top-0 z-50 shadow-sm w-full">
      
      {/* =========================================
          TOP BAR (Blueprint exactly jaisa Dark Maroon)
      ========================================= */}
      <div className="bg-[#8b1818] text-white py-1.5 px-4 md:px-8 text-xs font-medium flex justify-between items-center hidden md:flex">
        <div className="flex gap-6">
          <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> +91 98765 43210</span>
          <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> support@poojastore.com</span>
        </div>
        <div>
          <span>Free Shipping on Orders above ₹999 | 100% Authentic Samagri</span>
        </div>
      </div>

      {/* Main Navbar Background (Cream to match Hero Section) */}
      <div className="bg-[#fcfaf5]">
        
        {/* =========================================
            ROW 1: LOGO, SEARCH, ICONS & AUTH BUTTON
        ========================================= */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center gap-4 border-b border-[#8b1818]/10 md:border-none">
          
          {/* 1. Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="Pooja Store Logo" className="h-10 md:h-14 w-auto object-contain" />
          </Link>

          {/* 2. Search Bar (Theme matched border) */}
          <div className="hidden md:flex flex-grow max-w-xl mx-4 items-center bg-white border border-orange-200 rounded-md px-3 py-2 focus-within:border-[#f7941d] focus-within:ring-1 focus-within:ring-[#f7941d] transition-all shadow-sm">
            <input 
              type="text" 
              placeholder="Search Pooja Samagri..." 
              className="w-full outline-none text-sm bg-transparent text-gray-700 placeholder-gray-400" 
            />
            <Search className="text-[#8b1818] w-5 h-5 cursor-pointer hover:text-[#f7941d] transition-colors ml-2" />
          </div>

          {/* 3. Right Side Icons & Auth Button */}
          <div className="flex items-center gap-5 md:gap-6">
            
            {/* User Icon */}
            <Link to={token ? "/dashboard" : "/login"} className="text-[#8b1818] hover:text-[#f7941d] transition-colors">
              <User className="w-6 h-6" />
            </Link>
            
            {/* Cart Icon (Orange Badge) */}
            <Link to="/cart" className="relative text-[#8b1818] hover:text-[#f7941d] transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#f7941d] text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Login / Logout Button (Blueprint Solid Orange Button) */}
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
            ROW 2: NAVIGATION LINKS (Bottom Row)
        ========================================= */}
        <div className="hidden md:flex border-t border-[#8b1818]/10 bg-[#fcfaf5]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex gap-8 text-[15px] font-bold text-gray-700 uppercase tracking-wide">
            <Link to="/" className="hover:text-[#c21820] transition-colors">Home</Link>
            <Link to="/shop" className="hover:text-[#c21820] transition-colors">Shop</Link>
            <Link to="/subscriptions" className="hover:text-[#c21820] transition-colors">Subscriptions</Link>
            <Link to="/about" className="hover:text-[#c21820] transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-[#c21820] transition-colors">Contact</Link>
          </div>
        </div>
        
      </div>
    </header>
  );
};

export default Navbar;