import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Package, LogOut, ShoppingBag, MapPin, ChevronRight, 
  Truck, User, X, Home, CheckCircle, ShieldCheck, 
  CalendarHeart, PauseCircle, PlayCircle, Loader2, Sparkles 
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // ==========================================
  // 🎛️ STATES
  // ==========================================
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]); 
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeTab, setActiveTab] = useState('orders'); 

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: '', phone: '', street: '', city: '', state: '', pincode: ''
  });

  const API_BASE_URL = 'https://arpancart-production.up.railway.app/api';

  // Get User Details
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { name: 'Valued Customer', email: '', phone: '' };
  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'C';

  // Extract User ID from Token
  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      return decodedPayload.id || decodedPayload.userId;
    } catch (err) {
      return null;
    }
  };

  // ==========================================
  // 🔄 FETCH DASHBOARD DATA
  // ==========================================
  const fetchDashboardData = async () => {
    const token = localStorage.getItem('token');
    const userId = getUserIdFromToken();

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const requests = [
        axios.get(`${API_BASE_URL}/orders/my-orders`, config),
        axios.get(`${API_BASE_URL}/addresses`, config)
      ];

      if (userId) {
        requests.push(axios.get(`${API_BASE_URL}/subscriptions/user/${userId}`, config));
      }

      const responses = await Promise.allSettled(requests);

      if (responses[0].status === 'fulfilled' && responses[0].value.data.success) {
        setOrders(responses[0].value.data.data);
      }
      if (responses[1].status === 'fulfilled' && responses[1].value.data.success) {
        setAddresses(responses[1].value.data.data);
      }
      if (userId && responses[2] && responses[2].status === 'fulfilled' && responses[2].value.data.success) {
        setSubscriptions(responses[2].value.data.data);
      }
    } catch (err) {
      console.error("Dashboard fetching error:", err);
      setError("Could not load your data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // ==========================================
  // 📍 ADDRESS LOGIC
  // ==========================================
  const handleAddressChange = (e) => setAddressForm({ ...addressForm, [e.target.name]: e.target.value });

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingAddress(true);
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(`${API_BASE_URL}/addresses`, addressForm, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setAddresses([response.data.data, ...addresses]);
        setIsAddressModalOpen(false);
        setAddressForm({ fullName: '', phone: '', street: '', city: '', state: '', pincode: '' });
      }
    } catch (err) {
      alert("Failed to save address. Please try again.");
    } finally {
      setIsSubmittingAddress(false);
    }
  };

  // ==========================================
  // 🌸 SUBSCRIPTION CONTROL LOGIC
  // ==========================================
  const handleToggleSubscription = async (subId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const endpoint = currentStatus === 'ACTIVE' ? '/subscriptions/pause' : '/subscriptions/resume';
      
      const res = await axios.post(`${API_BASE_URL}${endpoint}`, { subscriptionId: subId }, config);
      
      if (res.data.success) {
        fetchDashboardData(); 
      }
    } catch (error) {
      alert("Something went wrong while updating your plan.");
    }
  };

  // 🎨 Dynamic Badge Generator (Premium UI)
  const getStatusBadge = (status) => {
    const baseClass = "px-4 py-1.5 text-[10px] font-black rounded-full uppercase tracking-widest shadow-sm";
    switch (status?.toUpperCase()) {
      case 'PROCESSING': 
      case 'PENDING': return `${baseClass} bg-orange-100 text-[#f7941d] border border-orange-200`;
      case 'SHIPPED': return `${baseClass} bg-blue-100 text-blue-700 border border-blue-200`;
      case 'DELIVERED': 
      case 'ACTIVE': return `${baseClass} bg-green-100 text-green-700 border border-green-200`;
      case 'PAUSED': return `${baseClass} bg-yellow-100 text-yellow-700 border border-yellow-200`;
      case 'COMPLETED': return `${baseClass} bg-gray-200 text-gray-800 border border-gray-300`;
      case 'CANCELLED': return `${baseClass} bg-red-100 text-red-700 border border-red-200`;
      default: return `${baseClass} bg-gray-100 text-gray-700`;
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#fcfaf5] to-white min-h-screen py-12 px-4 md:px-8 overflow-hidden relative font-sans">
      
      {/* Decorative Background Blob */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
      
      <style>
        {`
          @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-up { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        `}
      </style>

      {/* =========================================
          📍 ADDRESS MODAL (Premium Glassmorphism)
      ========================================= */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden relative animate-fade-up" style={{ animationDuration: '0.4s' }}>
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#f7941d] to-[#8b1818]"></div>
            
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-100 bg-white">
              <h3 className="font-extrabold text-gray-900 uppercase tracking-wide flex items-center gap-3">
                <div className="bg-orange-50 p-2 rounded-full"><MapPin className="w-5 h-5 text-[#f7941d]" /></div>
                Add New Address
              </h3>
              <button onClick={() => setIsAddressModalOpen(false)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddressSubmit} className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
                  <input type="text" name="fullName" value={addressForm.fullName} onChange={handleAddressChange} required className="w-full px-5 py-4 border border-gray-200 rounded-2xl outline-none focus:border-[#f7941d] focus:ring-4 focus:ring-orange-50 bg-gray-50 focus:bg-white transition-all text-sm font-bold text-gray-800 placeholder:font-medium placeholder:text-gray-400" placeholder="e.g. Amit Kumar" />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-2">Phone Number</label>
                  <input type="text" name="phone" value={addressForm.phone} onChange={handleAddressChange} required className="w-full px-5 py-4 border border-gray-200 rounded-2xl outline-none focus:border-[#f7941d] focus:ring-4 focus:ring-orange-50 bg-gray-50 focus:bg-white transition-all text-sm font-bold text-gray-800 placeholder:font-medium placeholder:text-gray-400" placeholder="e.g. 9876543210" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-2">Street Address / Flat No.</label>
                <textarea name="street" value={addressForm.street} onChange={handleAddressChange} required rows="2" className="w-full px-5 py-4 border border-gray-200 rounded-2xl outline-none focus:border-[#f7941d] focus:ring-4 focus:ring-orange-50 bg-gray-50 focus:bg-white transition-all resize-none text-sm font-bold text-gray-800 placeholder:font-medium placeholder:text-gray-400" placeholder="e.g. Flat 204, Rungta Apartments"></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-2">City</label>
                  <input type="text" name="city" value={addressForm.city} onChange={handleAddressChange} required className="w-full px-5 py-4 border border-gray-200 rounded-2xl outline-none focus:border-[#f7941d] focus:ring-4 focus:ring-orange-50 bg-gray-50 focus:bg-white transition-all text-sm font-bold text-gray-800" />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-2">State</label>
                  <input type="text" name="state" value={addressForm.state} onChange={handleAddressChange} required className="w-full px-5 py-4 border border-gray-200 rounded-2xl outline-none focus:border-[#f7941d] focus:ring-4 focus:ring-orange-50 bg-gray-50 focus:bg-white transition-all text-sm font-bold text-gray-800" />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-2">Pincode</label>
                  <input type="text" name="pincode" value={addressForm.pincode} onChange={handleAddressChange} required className="w-full px-5 py-4 border border-gray-200 rounded-2xl outline-none focus:border-[#f7941d] focus:ring-4 focus:ring-orange-50 bg-gray-50 focus:bg-white transition-all text-sm font-bold text-gray-800" />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row gap-4 justify-end mt-2">
                <button type="button" onClick={() => setIsAddressModalOpen(false)} className="px-6 py-4 text-sm font-extrabold text-gray-500 hover:text-gray-800 uppercase tracking-wider transition-colors w-full sm:w-auto">Cancel</button>
                <button type="submit" disabled={isSubmittingAddress} className="px-8 py-4 bg-gradient-to-r from-[#8b1818] to-[#b32424] hover:shadow-[0_8px_20px_rgba(139,24,24,0.25)] text-white text-sm font-extrabold rounded-2xl uppercase tracking-wider transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 w-full sm:w-auto">
                  {isSubmittingAddress ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><CheckCircle className="w-4 h-4" /> Save Address</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        
        {/* =========================================
            🌟 PAGE HEADER
        ========================================= */}
        <div className="mb-12 animate-fade-up">
          <div className="flex items-center justify-center mb-3 gap-2">
            <Sparkles className="w-5 h-5 text-[#f7941d]" />
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8b1818] to-[#d63031] text-center tracking-tight uppercase">
              My Dashboard
            </h1>
            <Sparkles className="w-5 h-5 text-[#f7941d]" />
          </div>
          <p className="text-gray-500 text-center font-medium flex justify-center items-center gap-2 text-sm md:text-base">
            <ShieldCheck className="w-4 h-4 text-green-600"/> Securely manage your orders, daily flowers, and addresses.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* =========================================
              📱 LEFT SIDE: SIDEBAR NAVIGATION
          ========================================= */}
          <div className="lg:w-1/4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden sticky top-24">
              
              <div className="bg-gradient-to-br from-[#8b1818] to-[#6e1313] p-8 text-center text-white relative overflow-hidden">
                {/* Decorative circle in sidebar header */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="w-24 h-24 bg-white/20 rounded-full mx-auto flex items-center justify-center backdrop-blur-md border border-white/40 mb-4 shadow-[0_0_20px_rgba(255,255,255,0.1)] relative z-10">
                  <span className="text-4xl font-black">{userInitial}</span>
                </div>
                <h3 className="text-2xl font-black tracking-wide uppercase relative z-10">{user.name}</h3>
                <p className="text-xs text-white/80 mt-2 flex items-center justify-center gap-1.5 font-bold tracking-widest relative z-10"><ShieldCheck className="w-3.5 h-3.5"/> VERIFIED ACCOUNT</p>
              </div>

              <nav className="p-4 space-y-2">
                <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-extrabold text-sm uppercase tracking-wider transition-all duration-300 ${activeTab === 'orders' ? 'bg-gradient-to-r from-orange-50 to-transparent text-[#8b1818] border-l-4 border-[#8b1818]' : 'text-gray-500 hover:bg-gray-50 hover:text-[#f7941d] border-l-4 border-transparent'}`}>
                  <span className="flex items-center gap-3"><Package className={`w-5 h-5 ${activeTab === 'orders' ? 'text-[#8b1818]' : ''}`} /> My Orders</span>
                  {activeTab === 'orders' && <ChevronRight className="w-4 h-4 text-[#8b1818]" />}
                </button>

                <button onClick={() => setActiveTab('subscriptions')} className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-extrabold text-sm uppercase tracking-wider transition-all duration-300 ${activeTab === 'subscriptions' ? 'bg-gradient-to-r from-orange-50 to-transparent text-[#8b1818] border-l-4 border-[#8b1818]' : 'text-gray-500 hover:bg-gray-50 hover:text-[#f7941d] border-l-4 border-transparent'}`}>
                  <span className="flex items-center gap-3"><CalendarHeart className={`w-5 h-5 ${activeTab === 'subscriptions' ? 'text-[#8b1818]' : ''}`} /> Daily Flowers</span>
                  {activeTab === 'subscriptions' && <ChevronRight className="w-4 h-4 text-[#8b1818]" />}
                </button>
                
                <button onClick={() => setActiveTab('addresses')} className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-extrabold text-sm uppercase tracking-wider transition-all duration-300 ${activeTab === 'addresses' ? 'bg-gradient-to-r from-orange-50 to-transparent text-[#8b1818] border-l-4 border-[#8b1818]' : 'text-gray-500 hover:bg-gray-50 hover:text-[#f7941d] border-l-4 border-transparent'}`}>
                  <span className="flex items-center gap-3"><MapPin className={`w-5 h-5 ${activeTab === 'addresses' ? 'text-[#8b1818]' : ''}`} /> Addresses</span>
                  {activeTab === 'addresses' && <ChevronRight className="w-4 h-4 text-[#8b1818]" />}
                </button>

                <div className="h-[1px] bg-gray-100 my-4 mx-4"></div>
                
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-red-500 hover:bg-red-50 font-extrabold text-sm uppercase tracking-wider transition-colors border-l-4 border-transparent">
                  <LogOut className="w-5 h-5" /> Secure Logout
                </button>
              </nav>
            </div>
          </div>

          {/* =========================================
              🖥️ RIGHT SIDE: DYNAMIC CONTENT AREA
          ========================================= */}
          <div className="lg:w-3/4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            
            {/* 🟢 TAB: MY ORDERS */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 md:p-10">
                <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-wide flex items-center gap-3 border-b border-gray-100 pb-5">
                  <div className="bg-orange-50 p-2.5 rounded-xl"><Package className="w-6 h-6 text-[#f7941d]" /></div>
                  Order History
                </h2>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20"><Loader2 className="w-12 h-12 text-[#8b1818] animate-spin mb-4" /><p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Orders...</p></div>
                ) : error ? (
                  <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-red-600 font-bold text-center flex items-center justify-center gap-2"><ShieldCheck className="w-5 h-5"/> {error}</div>
                ) : orders.length === 0 ? (
                  <div className="bg-gradient-to-b from-orange-50/50 to-transparent p-12 md:p-20 rounded-[2rem] border border-orange-100/50 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-white border border-orange-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                      <ShoppingBag className="w-12 h-12 text-[#f7941d]" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-800 mb-3 uppercase tracking-wide">No Orders Yet</h2>
                    <p className="text-gray-500 mb-8 font-medium">You haven't placed any divine orders with us yet.</p>
                    <Link to="/shop" className="bg-gradient-to-r from-[#8b1818] to-[#b32424] hover:shadow-[0_8px_20px_rgba(139,24,24,0.25)] text-white font-extrabold py-4 px-10 rounded-2xl transition-all active:scale-95 uppercase tracking-widest text-sm">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-[1.5rem] overflow-hidden hover:border-[#f7941d]/50 hover:shadow-[0_8px_30px_rgb(247,148,29,0.08)] transition-all duration-300">
                        
                        {/* Order Card Header */}
                        <div className="bg-gray-50/80 p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between md:items-center gap-5">
                          <div className="flex flex-wrap gap-x-10 gap-y-4">
                            <div>
                              <p className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest mb-1">Order Placed</p>
                              <p className="font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric'})}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest mb-1">Total Amount</p>
                              <p className="font-black text-[#8b1818] text-lg leading-none">₹{order.totalAmount}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest mb-1">Order ID</p>
                              <p className="font-bold text-gray-900">#ARP_{order.id.toString().padStart(5, '0')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {getStatusBadge(order.status)}
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-6 space-y-5 bg-white">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-5 group">
                              <div className="w-20 h-20 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden flex-shrink-0 p-1">
                                <img src={item.product?.imageUrl || "https://placehold.co/300x300/fcfaf5/8b1818.jpg&text=ArpanCart"} alt="Product" className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-500" />
                              </div>
                              <div className="flex-grow">
                                <h4 className="font-extrabold text-gray-900 line-clamp-1">{item.product?.title || "Divine Pooja Item"}</h4>
                                <div className="flex items-center gap-3 mt-2">
                                  <span className="bg-gray-100 text-gray-600 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                                    Qty: {item.quantity}
                                  </span>
                                  <span className="text-gray-400 text-xs font-bold">× ₹{item.price}</span>
                                </div>
                              </div>
                              <div className="text-right pl-4 border-l border-gray-100">
                                <p className="font-black text-gray-900 text-lg">₹{item.price * item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Order Action Footer */}
                        <div className="bg-white px-6 py-4 border-t border-gray-100 text-right">
                           <Link to="/track-order" className="inline-flex items-center gap-2 text-sm font-extrabold text-[#f7941d] hover:text-[#d67b11] uppercase tracking-wider transition-colors">
                             Track Order <ChevronRight className="w-4 h-4" />
                           </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 🌸 TAB: MY SUBSCRIPTIONS (DAILY FLOWERS) */}
            {activeTab === 'subscriptions' && (
              <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 md:p-10">
                <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-wide flex items-center gap-3 border-b border-gray-100 pb-5">
                  <div className="bg-orange-50 p-2.5 rounded-xl"><CalendarHeart className="w-6 h-6 text-[#f7941d]" /></div>
                  Daily Flowers
                </h2>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20"><Loader2 className="w-12 h-12 text-[#8b1818] animate-spin mb-4" /><p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Plans...</p></div>
                ) : subscriptions.length === 0 ? (
                  <div className="bg-gradient-to-b from-orange-50/50 to-transparent p-12 md:p-20 rounded-[2rem] border border-orange-100/50 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-white border border-orange-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                      <CalendarHeart className="w-12 h-12 text-[#f7941d]" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-800 mb-3 uppercase tracking-wide">No Active Plans</h2>
                    <p className="text-gray-500 mb-8 font-medium max-w-sm mx-auto">Start your daily morning pooja with fresh, handpicked flowers delivered to your door.</p>
                    <Link to="/subscriptions" className="bg-gradient-to-r from-[#8b1818] to-[#b32424] hover:shadow-[0_8px_20px_rgba(139,24,24,0.25)] text-white font-extrabold py-4 px-10 rounded-2xl transition-all active:scale-95 uppercase tracking-widest text-sm flex items-center gap-2">
                      View Flower Plans <Sparkles className="w-4 h-4"/>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {subscriptions.map((sub) => (
                      <div key={sub.id} className={`bg-white border rounded-[1.5rem] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all duration-300 relative overflow-hidden ${sub.status === 'ACTIVE' ? 'border-[#f7941d]/50' : 'border-gray-200'}`}>
                        {/* Status Indicator Line */}
                        <div className={`absolute top-0 left-0 w-1.5 h-full ${sub.status === 'ACTIVE' ? 'bg-gradient-to-b from-green-400 to-green-600' : sub.status === 'PAUSED' ? 'bg-gradient-to-b from-yellow-400 to-yellow-600' : 'bg-gray-300'}`}></div>
                        
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">{sub.plan?.name || "Daily Plan"}</h4>
                            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mt-1">ID: #SUB_{sub.id}</p>
                          </div>
                          {getStatusBadge(sub.status)}
                        </div>
                        
                        <div className="bg-gray-50/80 p-5 rounded-2xl mb-6 space-y-3 border border-gray-100">
                          <div className="flex justify-between text-sm items-center">
                            <span className="text-gray-500 font-extrabold uppercase text-[10px] tracking-widest">Start Date</span>
                            <span className="font-bold text-gray-800">{new Date(sub.startDate).toLocaleDateString('en-IN', {day:'numeric', month:'short'})}</span>
                          </div>
                          <div className="flex justify-between text-sm items-center">
                            <span className="text-gray-500 font-extrabold uppercase text-[10px] tracking-widest">End Date</span>
                            <span className="font-bold text-gray-800">{new Date(sub.endDate).toLocaleDateString('en-IN', {day:'numeric', month:'short'})}</span>
                          </div>
                          <div className="flex justify-between text-sm items-center pt-3 border-t border-gray-200 border-dashed">
                            <span className="text-gray-500 font-extrabold uppercase text-[10px] tracking-widest">Days Left</span>
                            <span className="font-black text-[#c21820] text-xl leading-none">{sub.remainingDays}</span>
                          </div>
                        </div>

                        {sub.status !== 'COMPLETED' && sub.status !== 'CANCELLED' && (
                          <div className="flex justify-end mt-auto">
                            {sub.status === 'ACTIVE' ? (
                              <button onClick={() => handleToggleSubscription(sub.id, 'ACTIVE')} className="w-full flex justify-center items-center gap-2 px-5 py-3.5 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 hover:shadow-md border border-yellow-200 font-extrabold text-xs rounded-xl transition-all uppercase tracking-widest active:scale-95">
                                <PauseCircle className="w-4 h-4" /> Pause Delivery
                              </button>
                            ) : sub.status === 'PAUSED' ? (
                              <button onClick={() => handleToggleSubscription(sub.id, 'PAUSED')} className="w-full flex justify-center items-center gap-2 px-5 py-3.5 bg-green-50 text-green-700 hover:bg-green-100 hover:shadow-md border border-green-200 font-extrabold text-xs rounded-xl transition-all uppercase tracking-widest active:scale-95">
                                <PlayCircle className="w-4 h-4" /> Resume Delivery
                              </button>
                            ) : null}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 📍 TAB: SAVED ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 md:p-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-gray-100 pb-5">
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-wide flex items-center gap-3">
                    <div className="bg-orange-50 p-2.5 rounded-xl"><MapPin className="w-6 h-6 text-[#f7941d]" /></div>
                    Saved Addresses
                  </h2>
                  
                  {/* Floating Add Button for Desktop */}
                  <button 
                    onClick={() => setIsAddressModalOpen(true)}
                    className="hidden sm:flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-full font-extrabold text-xs uppercase tracking-widest transition-colors shadow-md"
                  >
                    <span className="text-lg leading-none">+</span> Add New
                  </button>
                </div>
                
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20"><Loader2 className="w-12 h-12 text-[#8b1818] animate-spin mb-4" /><p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Addresses...</p></div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {addresses.map((addr, index) => (
                      <div key={addr.id} className={`bg-white p-7 rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative group transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] border-[2px] ${index === 0 ? 'border-[#f7941d]/50' : 'border-gray-100'}`}>
                        {index === 0 && <span className="absolute top-0 right-0 bg-gradient-to-l from-[#f7941d] to-[#e67e22] text-white text-[9px] font-black px-4 py-1.5 rounded-bl-2xl rounded-tr-[1.3rem] uppercase tracking-widest shadow-sm">Primary</span>}
                        
                        <h4 className="font-black text-gray-900 text-lg mb-4 flex items-center gap-2 tracking-wide uppercase">
                          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center"><User className="w-4 h-4 text-[#8b1818]"/></div>
                          {addr.fullName}
                        </h4>
                        
                        <div className="text-gray-600 text-sm leading-relaxed font-medium space-y-2.5 bg-gray-50/80 p-5 rounded-2xl border border-gray-100">
                          <div className="flex items-start gap-3">
                            <Home className="w-4 h-4 text-[#f7941d] mt-0.5 flex-shrink-0"/> 
                            <p className="flex-1">{addr.street}</p>
                          </div>
                          <div className="ml-7">
                            <p>{addr.city}, {addr.state}</p>
                            <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest">PIN: <span className="font-black text-gray-800 text-sm">{addr.pincode}</span></p>
                          </div>
                          <div className="ml-7 pt-3 mt-3 border-t border-gray-200 border-dashed">
                            <p className="font-bold text-gray-900 flex items-center gap-2">📞 {addr.phone}</p>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div 
                      onClick={() => setIsAddressModalOpen(true)}
                      className="bg-gray-50/50 p-6 rounded-[1.5rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-orange-50/30 hover:border-[#f7941d]/50 transition-all duration-300 min-h-[260px] group"
                    >
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400 group-hover:bg-[#f7941d] group-hover:text-white transition-all duration-300 mb-4 transform group-hover:scale-110 group-hover:rotate-90">
                        <span className="text-3xl font-light leading-none">+</span>
                      </div>
                      <p className="font-extrabold text-gray-500 group-hover:text-[#8b1818] uppercase tracking-widest text-sm">Add New Address</p>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;