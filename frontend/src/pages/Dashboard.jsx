import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, LogOut, ShoppingBag, MapPin } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Check Security: Agar login nahi hai, toh wapas bhej do
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // 2. Fetch Data: Backend API se purane orders laao
    const fetchMyOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders/my-orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data.data);
      } catch (err) {
        console.error("Orders fetching error:", err);
        setError("Orders load nahi ho paye. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload();
  };

  // Order status ke hisaab se colors
  const getStatusBadge = (status) => {
    const baseClass = "px-3 py-1 text-xs font-bold rounded uppercase tracking-wider";
    switch (status) {
      case 'Processing': return `${baseClass} bg-orange-100 text-[#f7941d] border border-orange-200`;
      case 'Shipped': return `${baseClass} bg-blue-100 text-blue-700 border border-blue-200`;
      case 'Delivered': return `${baseClass} bg-green-100 text-green-700 border border-green-200`;
      default: return `${baseClass} bg-gray-100 text-gray-700 border border-gray-200`;
    }
  };

  return (
    <div className="bg-[#fcfaf5] min-h-screen py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* =========================================
            PAGE HEADER (Theme Matched)
        ========================================= */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="hidden md:flex items-center">
              <div className="w-12 lg:w-24 h-[1px] bg-[#8b1818] opacity-40"></div>
              <div className="w-1.5 h-1.5 bg-[#8b1818] transform rotate-45 mx-1.5 opacity-60"></div>
              <div className="w-1.5 h-1.5 bg-[#8b1818] transform rotate-45 mx-1.5 opacity-60"></div>
            </div>
            
            <h1 className="text-3xl md:text-[40px] font-extrabold text-[#8b1818] px-6 text-center tracking-wide">
              My Account
            </h1>

            <div className="hidden md:flex items-center">
              <div className="w-1.5 h-1.5 bg-[#8b1818] transform rotate-45 mx-1.5 opacity-60"></div>
              <div className="w-1.5 h-1.5 bg-[#8b1818] transform rotate-45 mx-1.5 opacity-60"></div>
              <div className="w-12 lg:w-24 h-[1px] bg-[#8b1818] opacity-40"></div>
            </div>
          </div>
          <p className="text-gray-500 text-center font-medium">View your order history and manage your account.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* =========================================
              LEFT SIDE: SIDEBAR MENU
          ========================================= */}
          <div className="lg:w-1/4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-50 sticky top-24">
              
              {/* User Greeting Box */}
              <div className="bg-[#fcfaf5] p-4 rounded-lg border border-orange-100 mb-6 text-center">
                <div className="w-16 h-16 bg-[#8b1818] text-white rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                  {/* Ek fake initial dikhane ke liye (Actual user data API se le sakte ho baad me) */}
                  U
                </div>
                <h3 className="font-bold text-gray-800 text-lg">Welcome Back!</h3>
              </div>

              {/* Menu Links */}
              <nav className="space-y-2">
                <button className="w-full flex items-center gap-3 bg-[#8b1818] text-white font-bold py-3 px-4 rounded-lg transition-colors">
                  <Package className="w-5 h-5" /> My Orders
                </button>
                <button className="w-full flex items-center gap-3 text-gray-600 hover:bg-[#fcfaf5] hover:text-[#c21820] font-bold py-3 px-4 rounded-lg transition-colors border border-transparent hover:border-orange-100">
                  <MapPin className="w-5 h-5" /> Saved Addresses
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 text-gray-600 hover:bg-red-50 hover:text-red-600 font-bold py-3 px-4 rounded-lg transition-colors border border-transparent hover:border-red-100 mt-4"
                >
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </nav>
            </div>
          </div>

          {/* =========================================
              RIGHT SIDE: ORDER HISTORY
          ========================================= */}
          <div className="lg:w-3/4">
            
            {loading && (
              <div className="bg-white p-10 rounded-xl shadow-sm border border-orange-50 text-center text-[#8b1818] font-bold animate-pulse text-xl">
                Fetching your orders...
              </div>
            )}
            
            {error && (
              <div className="bg-white p-10 rounded-xl shadow-sm border border-red-50 text-center text-red-500 font-bold text-xl">
                {error}
              </div>
            )}

            {!loading && !error && orders.length === 0 && (
              <div className="bg-white p-16 rounded-xl shadow-sm border border-orange-50 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-[#fcfaf5] rounded-full flex items-center justify-center mb-6">
                  <ShoppingBag className="w-12 h-12 text-[#f7941d]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h2>
                <p className="text-gray-500 mb-6 font-medium">You haven't placed any pooja samagri orders.</p>
                <button 
                  onClick={() => navigate('/shop')}
                  className="bg-[#f7941d] hover:bg-[#e0861a] text-white font-bold py-3 px-8 rounded shadow-md transition-all hover:shadow-lg active:scale-95"
                >
                  Start Shopping
                </button>
              </div>
            )}

            {!loading && !error && orders.length > 0 && (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden hover:shadow-md transition-shadow">
                    
                    {/* Order Header */}
                    <div className="bg-[#fcfaf5] p-5 md:p-6 border-b border-orange-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex gap-8">
                        <div>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Order Placed</p>
                          <p className="font-bold text-gray-800">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Amount</p>
                          <p className="font-extrabold text-[#c21820]">₹{order.totalAmount}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:items-end">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Order ID</p>
                        <p className="font-bold text-gray-800">#ARP_{order.id.toString().padStart(6, '0')}</p>
                        <div className="mt-2">
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                    </div>

                    {/* Order Items List */}
                    <div className="p-5 md:p-6 space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-[#fcfaf5] rounded-md border border-orange-50 overflow-hidden flex-shrink-0">
                            <img src={item.product.imageUrl} alt={item.product.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-bold text-gray-800 hover:text-[#c21820] transition-colors cursor-pointer" onClick={() => navigate(`/product/${item.product.id}`)}>
                              {item.product.title}
                            </h4>
                            <p className="text-sm text-gray-500 font-medium mt-1">
                              ₹{item.price} <span className="mx-1">x</span> {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-800">₹{item.price * item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                ))}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;