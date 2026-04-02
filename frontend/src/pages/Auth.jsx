import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Type karte hi purana error hata do
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const url = isLogin 
      ? 'https://arpancart.onrender.com/api/auth/login' 
      : 'https://arpancart.onrender.com/api/auth/register';

    try {
      const response = await axios.post(url, formData);
      
      if (response.data.success) {
        // Token ko localStorage me save karo
        localStorage.setItem('token', response.data.token);
        
        // Success alert aur redirect
        alert(`🎉 ${isLogin ? 'Login Successful!' : 'Account Created Successfully!'}`);
        
        // Login ke baad turant homepage ya dashboard bhej do
        navigate('/');
        
        // Navbar ko update karne ke liye page refresh (Optional, but easy way to sync state)
        window.location.reload(); 
      }
    } catch (err) {
      console.error("Auth Error:", err);
      setError(err.response?.data?.message || "Kuch galat ho gaya. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Cream background matching the overall theme
    <div className="min-h-[85vh] flex items-center justify-center bg-[#fcfaf5] py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Main Card Container */}
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col md:flex-row border border-orange-50">
        
        {/* =========================================
            LEFT SIDE: IMAGE OVERLAY (Premium Feel)
        ========================================= */}
        <div className="md:w-1/2 relative hidden md:block bg-orange-100">
          <img 
            src="https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=800&auto=format&fit=crop" 
            alt="Pooja Samagri" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Maroon Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#8b1818]/90 via-[#8b1818]/40 to-transparent flex flex-col justify-end p-10">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome to Arpancart</h2>
            <p className="text-white/80 font-medium">
              Your trusted destination for pure, authentic, and premium pooja samagri.
            </p>
          </div>
        </div>

        {/* =========================================
            RIGHT SIDE: AUTH FORM
        ========================================= */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-[#8b1818]">
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p className="text-gray-500 mt-2 font-medium">
              {isLogin ? 'Login to access your orders and subscriptions.' : 'Sign up to get started with your spiritual journey.'}
            </p>
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm font-bold text-center mb-6 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Name Field (Only for Signup) */}
            {!isLogin && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  required={!isLogin}
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] transition-all bg-gray-50 focus:bg-white text-gray-700"
                />
              </div>
            )}

            {/* Email Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] transition-all bg-gray-50 focus:bg-white text-gray-700"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] transition-all bg-gray-50 focus:bg-white text-gray-700"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#8b1818] hover:bg-[#6e1313] text-white font-bold text-lg py-3.5 rounded-md shadow-md transition-all duration-300 hover:shadow-lg active:scale-95 disabled:opacity-70"
            >
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-gray-600 font-medium">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }}
                className="ml-2 text-[#f7941d] hover:text-[#e0861a] font-bold transition-colors underline decoration-2 underline-offset-4"
              >
                {isLogin ? 'Create one' : 'Login here'}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Auth;