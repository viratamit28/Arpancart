import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, User as UserIcon, ArrowRight, Phone, KeyRound, ArrowLeft, KeySquare } from 'lucide-react'; 
import poojaImage from '../assets/2.jpg';

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  // 🔥 FORGOT PASSWORD STATES
  const [isForgotPassword, setIsForgotPassword] = useState(false); 
  const [forgotStep, setForgotStep] = useState(1); // Step 1: Mobile, Step 2: OTP & New Password
  const [resetMobile, setResetMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobileNumber: ''
  });

  const API_BASE_URL = 'https://arpancart-production.up.railway.app/api';

  // ==========================================
  // 🛡️ STRICT INPUT VALIDATION
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'mobileNumber') {
      const numericValue = value.replace(/\D/g, ''); 
      if (numericValue.length <= 10) setFormData({ ...formData, [name]: numericValue });
    } 
    else if (name === 'name') {
      const alphabeticValue = value.replace(/[^a-zA-Z\s]/g, '');
      setFormData({ ...formData, [name]: alphabeticValue });
    } 
    else {
      setFormData({ ...formData, [name]: value });
    }
    
    setError(null); 
    setSuccessMsg(null);
  };

  // ==========================================
  // 🚀 MAIN SUBMIT LOGIC (Login / Signup)
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!isLogin) {
      if (formData.name.trim().length < 3) {
        setError("Please enter your full valid name.");
        return;
      }
      if (formData.mobileNumber.length !== 10) {
        setError("Please enter exactly 10 digits for the mobile number.");
        return;
      }
    }

    setLoading(true);

    const url = isLogin 
      ? `${API_BASE_URL}/auth/login` 
      : `${API_BASE_URL}/auth/register`;

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

  // ==========================================
  // 🔑 FORGOT PASSWORD (STEP 1: SEND OTP)
  // ==========================================
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (resetMobile.length !== 10) {
      setError("Please enter a valid 10-digit registered mobile number.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { mobileNumber: resetMobile });
      setSuccessMsg(`OTP sent successfully! ( OTP: ${response.data.demoOtp})`); // Remove demoOtp in production
      setForgotStep(2); // Move to Step 2
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Please check the number.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 🔒 RESET PASSWORD (STEP 2: VERIFY OTP & RESET)
  // ==========================================
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (otp.length !== 4) {
      setError("Please enter a valid 4-digit OTP.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, { 
        mobileNumber: resetMobile, 
        otp, 
        newPassword 
      });
      
      setSuccessMsg(response.data.message || "Password reset successful! You can now log in.");
      
      // Reset view to Login after 2 seconds
      setTimeout(() => {
        toggleAuthMode(true);
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. OTP might be invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  // Toggles
  const toggleAuthMode = (forceLogin = false) => {
    setIsLogin(forceLogin === true ? true : !isLogin);
    setIsForgotPassword(false);
    setForgotStep(1);
    setResetMobile('');
    setOtp('');
    setNewPassword('');
    setError(null);
    setSuccessMsg(null);
    setFormData({ name: '', email: '', password: '', mobileNumber: '' });
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
    setForgotStep(1);
    setResetMobile('');
    setOtp('');
    setNewPassword('');
    setError(null);
    setSuccessMsg(null);
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
              {isForgotPassword 
                ? 'Reset Password' 
                : (isLogin ? 'Welcome Back' : 'Create an Account')}
            </h2>
            <p className="text-gray-500 mt-2 font-medium">
              {isForgotPassword 
                ? (forgotStep === 1 ? 'Enter your mobile number to receive an OTP.' : 'Enter OTP and your new password.')
                : (isLogin ? 'Login to access your orders and subscriptions.' : 'Sign up to get started with your spiritual journey.')}
            </p>
          </div>

          {/* MESSAGES */}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm font-bold text-center mb-6 border border-red-100">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm font-bold text-center mb-6 border border-green-100">
              {successMsg}
            </div>
          )}

          {/* =========================================
              FORGOT PASSWORD VIEW
          ========================================= */}
          {isForgotPassword ? (
            <form onSubmit={forgotStep === 1 ? handleSendOtp : handleResetPassword} className="space-y-5">
              
              {forgotStep === 1 && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none">
                    <span className="text-gray-500 font-medium border-r border-gray-300 pr-2">+91</span>
                  </div>
                  <input
                    type="tel"
                    placeholder="10-digit Mobile Number"
                    required
                    value={resetMobile}
                    onChange={(e) => { 
                      const val = e.target.value.replace(/\D/g, '');
                      if(val.length <= 10) setResetMobile(val); 
                      setError(null); 
                    }}
                    className="w-full pl-[5.5rem] pr-4 py-3 border border-gray-200 rounded-md outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] transition-all bg-gray-50 focus:bg-white text-gray-700 tracking-wider"
                  />
                </div>
              )}

              {forgotStep === 2 && (
                <>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeySquare className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter 4-digit OTP"
                      required
                      value={otp}
                      onChange={(e) => { 
                        const val = e.target.value.replace(/\D/g, '');
                        if(val.length <= 4) setOtp(val); 
                        setError(null); 
                      }}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] transition-all bg-gray-50 focus:bg-white text-gray-700 tracking-[0.2em] font-bold"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      placeholder="Enter New Password"
                      required
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setError(null); }}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] transition-all bg-gray-50 focus:bg-white text-gray-700"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#f7941d] hover:bg-[#e0861a] text-white font-bold text-lg py-3.5 rounded-md shadow-md transition-all duration-300 active:scale-95 disabled:opacity-70"
              >
                {loading ? 'Processing...' : (forgotStep === 1 ? 'Get OTP' : 'Reset Password')}
                {!loading && <KeyRound className="w-5 h-5" />}
              </button>

              <div className="text-center mt-6">
                <button 
                  type="button" 
                  onClick={toggleForgotPassword}
                  className="text-gray-500 hover:text-[#8b1818] font-bold text-sm flex items-center justify-center gap-1 w-full transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </button>
              </div>
            </form>

          ) : (
            
          /* =========================================
              STANDARD LOGIN / SIGNUP VIEW
          ========================================= */
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {!isLogin && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name (Alphabets only)"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] transition-all bg-gray-50 focus:bg-white text-gray-700"
                  />
                </div>
              )}

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
                    placeholder="10-digit Mobile Number"
                    required={!isLogin}
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    className="w-full pl-[5.5rem] pr-4 py-3 border border-gray-200 rounded-md outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] transition-all bg-gray-50 focus:bg-white text-gray-700 tracking-wider"
                  />
                </div>
              )}

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

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password (Min 6 chars)"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] transition-all bg-gray-50 focus:bg-white text-gray-700"
                />
              </div>

              {isLogin && (
                <div className="flex justify-end mt-1">
                  <button 
                    type="button" 
                    onClick={toggleForgotPassword}
                    className="text-xs font-bold text-gray-500 hover:text-[#f7941d] transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#8b1818] hover:bg-[#6e1313] text-white font-bold text-lg py-3.5 rounded-md shadow-md transition-all duration-300 hover:shadow-lg active:scale-95 disabled:opacity-70 mt-4"
              >
                {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
          )}

          {!isForgotPassword && (
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
          )}

        </div>
      </div>
    </div>
  );
};

export default Auth;