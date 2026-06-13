import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, User as UserIcon, ArrowRight, Phone } from 'lucide-react'; 
import poojaImage from '../assets/2.jpg';

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobileNumber: '' // New field added
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Strict real-time validation for mobile number (only digits, max 10 characters)
    if (name === 'mobileNumber') {
      const numericValue = value.replace(/\D/g, ''); // Remove non-numeric characters
      if (numericValue.length <= 10) {
        setFormData({ ...formData, [name]: numericValue });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    setError(null); // Clear errors as user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final frontend validation before hitting the API
    if (!isLogin && formData.mobileNumber.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    setError(null);

    const url = isLogin 
      ? 'https://arpancart-production.up.railway.app/api/auth/login' 
      : 'https://arpancart-production.up.railway.app/api/auth/register';

    try {
      const response = await axios.post(url, formData);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        alert(`🎉 ${isLogin ? 'Login Successful!' : 'Account Created Successfully!'}`);
        navigate('/');
        window.location.reload(); 
      }
    } catch (err) {
      console.error("Auth Error:", err);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    // Reset form when toggling
    setFormData({ name: '', email: '', password: '', mobileNumber: '' });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#fcfaf5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col md:flex-row border border-orange-50">
        
        {/* LEFT SIDE: IMAGE OVERLAY */}
        <div className="md:w-1/2 relative hidden md:block bg-orange-100">
          <img 
            src={poojaImage} 
            alt="Pooja Samagri" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#8b1818]/90 via-[#8b1818]/40 to-transparent flex flex-col justify-end p-10">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome to Arpancart</h2>
            <p className="text-white/80 font-medium">
              Your trusted destination for pure, authentic, and premium pooja samagri.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: AUTH FORM */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-[#8b1818]">
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p className="text-gray-500 mt-2 font-medium">
              {isLogin ? 'Login to access your orders and subscriptions.' : 'Sign up to get started with your spiritual journey.'}
            </p>
          </div>

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

            {/* Mobile Number Field (Only for Signup) */}
            {!isLogin && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-medium border-r border-gray-300 pr-2">+91</span>
                </div>
                <input
                  type="tel"
                  name="mobileNumber"
                  placeholder="Mobile Number"
                  required={!isLogin}
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className="w-full pl-[5.5rem] pr-4 py-3 border border-gray-200 rounded-md outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] transition-all bg-gray-50 focus:bg-white text-gray-700"
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
                onClick={toggleAuthMode}
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