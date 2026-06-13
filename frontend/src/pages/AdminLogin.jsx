import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 🔥 Naye Railway Admin Login API ko hit kar rahe hain
      const response = await axios.post('http://localhost:5000/api/auth/admin-login', formData);
      
      if (response.data.success) {
        // Admin ka token aur details localStorage me save karo
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        alert("👑 Admin Login Successful! Welcome back.");
        
        // Login hote hi seedha Admin Dashboard bhej do
        navigate('/admin/dashboard');
        window.location.reload(); // State sync karne ke liye
      }
    } catch (err) {
      console.error("Admin Auth Error:", err);
      setError(err.response?.data?.message || "Login fail ho gaya. Kripya details check karein.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#fcfaf5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-sm shadow-sm border border-orange-100 border-t-4 border-[#8b1818]">
        
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-red-50 text-[#8b1818] flex items-center justify-center rounded-sm mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 uppercase tracking-wide">
            ArpanCart Admin Gateway
          </h2>
          <p className="text-xs text-gray-500 mt-2 font-bold uppercase tracking-wider">
            Authorized Personnel Only
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-sm text-sm font-bold text-center mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Admin Email Address"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-sm outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] transition-all bg-gray-50 focus:bg-white text-gray-700 font-medium"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              name="password"
              placeholder="Secure Password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-sm outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] transition-all bg-gray-50 focus:bg-white text-gray-700 font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#8b1818] hover:bg-[#6e1313] text-white font-extrabold text-sm py-3.5 rounded-sm shadow-sm transition-all duration-300 active:scale-95 disabled:opacity-70 uppercase tracking-widest"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
            ) : (
              <>Secure Access <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default AdminLogin;
