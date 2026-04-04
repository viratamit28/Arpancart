import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Package, LogOut, ShoppingBag, MapPin, ChevronRight, Truck, User, X, Home, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Orders & Addresses States
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Tab Navigation State
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'addresses'

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: '', phone: '', street: '', city: '', state: '', pincode: ''
  });

  // Get User Details from LocalStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { name: 'Valued Customer', email: '' };
  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'C';

  useEffect(() => {
    // 1. Check Security
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // 2. Fetch Data: Orders aur Addresses dono ek sath laao
    const fetchDashboardData = async () => {
      try {
        const [ordersRes, addressesRes] = await Promise.all([
          axios.get('https://arpancart.onrender.com/api/orders/my-orders', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('https://arpancart.onrender.com/api/addresses', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        setOrders(ordersRes.data.data);
        setAddresses(addressesRes.data.data);
      } catch (err) {
        console.error("Dashboard fetching error:", err);
        setError("Data load nahi ho paya. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  // Address Form Handlers
  const handleAddressChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingAddress(true);
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post('https://arpancart.onrender.com/api/addresses', addressForm, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        // Naya address list ke aage jod do (without refreshing page)
        setAddresses([response.data.data, ...addresses]);
        setIsAddressModalOpen(false);
        // Form clear kar do
        setAddressForm({ fullName: '', phone: '', street: '', city: '', state: '', pincode: '' });
      }
    } catch (err) {
      console.error("Address save error:", err);
      alert("Address save nahi ho paya. Please check details.");
    } finally {
      setIsSubmittingAddress(false);
    }
  };

  // Order status ke hisaab se premium sharp colors
  const getStatusBadge = (status) => {
    const baseClass = "px-4 py-1.5 text-[10px] font-extrabold rounded-sm uppercase tracking-widest shadow-sm";
    switch (status) {
      case 'Processing': return `${baseClass} bg-orange-50 text-[#f7941d] border border-orange-200`;
      case 'Shipped': return `${baseClass} bg-blue-50 text-blue-700 border border-blue-200`;
      case 'Delivered': return `${baseClass} bg-green-50 text-green-700 border border-green-200`;
      default: return `${baseClass} bg-gray-50 text-gray-700 border border-gray-200`;
    }
  };

  return (
    <div className="bg-[#fcfaf5] min-h-screen py-16 px-6 md:px-12 overflow-hidden relative">
      
      <style>
        {`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-up {
            animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
          }
        `}
      </style>

      {/* =========================================
          ADDRESS MODAL (Sharp & Corporate)
      ========================================= */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-up" style={{ opacity: 1 }}>
          <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl border-t-4 border-[#8b1818] overflow-hidden">
            
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#fcfaf5]">
              <h3 className="font-extrabold text-gray-800 uppercase tracking-wide flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#f7941d]" /> Add New Address
              </h3>
              <button onClick={() => setIsAddressModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddressSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-1.5">Full Name</label>
                  <input type="text" name="fullName" value={addressForm.fullName} onChange={handleAddressChange} required placeholder="e.g. Amit Kumar" className="w-full px-4 py-2.5 border border-gray-200 rounded-sm outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] bg-gray-50 focus:bg-white transition-all text-sm font-bold text-gray-800" />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-1.5">Phone Number</label>
                  <input type="text" name="phone" value={addressForm.phone} onChange={handleAddressChange} required placeholder="e.g. 9876543210" className="w-full px-4 py-2.5 border border-gray-200 rounded-sm outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] bg-gray-50 focus:bg-white transition-all text-sm font-bold text-gray-800" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-1.5">Street Address / Flat No.</label>
                <textarea name="street" value={addressForm.street} onChange={handleAddressChange} required rows="2" placeholder="e.g. Flat 204, Rungta Apartments" className="w-full px-4 py-2.5 border border-gray-200 rounded-sm outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] bg-gray-50 focus:bg-white transition-all resize-none text-sm font-bold text-gray-800"></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-1.5">City</label>
                  <input type="text" name="city" value={addressForm.city} onChange={handleAddressChange} required placeholder="e.g. Patna" className="w-full px-4 py-2.5 border border-gray-200 rounded-sm outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] bg-gray-50 focus:bg-white transition-all text-sm font-bold text-gray-800" />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-1.5">State</label>
                  <input type="text" name="state" value={addressForm.state} onChange={handleAddressChange} required placeholder="e.g. Bihar" className="w-full px-4 py-2.5 border border-gray-200 rounded-sm outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] bg-gray-50 focus:bg-white transition-all text-sm font-bold text-gray-800" />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-1.5">Pincode</label>
                  <input type="text" name="pincode" value={addressForm.pincode} onChange={handleAddressChange} required placeholder="e.g. 800001" className="w-full px-4 py-2.5 border border-gray-200 rounded-sm outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] bg-gray-50 focus:bg-white transition-all text-sm font-bold text-gray-800" />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex gap-4 justify-end">
                <button type="button" onClick={() => setIsAddressModalOpen(false)} className="px-6 py-2.5 text-sm font-extrabold text-gray-500 hover:text-gray-800 uppercase tracking-wider transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmittingAddress} className="px-8 py-2.5 bg-gradient-to-r from-[#8b1818] to-[#6e1313] hover:from-[#f7941d] hover:to-[#e0861a] text-white text-sm font-extrabold rounded-sm uppercase tracking-wider shadow-md transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2">
                  {isSubmittingAddress ? 'Saving...' : <><CheckCircle className="w-4 h-4" /> Save Address</>}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        
        {/* =========================================
            PAGE HEADER
        ========================================= */}
        <div className="mb-12 animate-fade-up">
          <div className="flex items-center justify-center mb-4">
            <div className="hidden md:flex items-center">
              <div className="w-16 lg:w-32 h-[1px] bg-gradient-to-l from-[#8b1818] to-transparent opacity-50"></div>
              <div className="w-2 h-2 bg-[#f7941d] transform rotate-45 mx-4 shadow-sm"></div>
            </div>
            
            <h1 className="text-3xl md:text-[40px] font-extrabold text-[#8b1818] px-6 text-center tracking-wide uppercase">
              My Account
            </h1>

            <div className="hidden md:flex items-center">
              <div className="w-2 h-2 bg-[#f7941d] transform rotate-45 mx-4 shadow-sm"></div>
              <div className="w-16 lg:w-32 h-[1px] bg-gradient-to-r from-[#8b1818] to-transparent opacity-50"></div>
            </div>
          </div>
          <p className="text-gray-500 text-center font-medium">Manage your orders, tracking, and personal details.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* =========================================
              LEFT SIDE: SIDEBAR NAVIGATION
          ========================================= */}
          <div className="lg:w-1/4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white p-6 rounded-sm shadow-sm border border-orange-50 sticky top-24">
              
              <div className="bg-gradient-to-br from-[#fcfaf5] to-white p-6 rounded-sm border border-orange-100 mb-8 text-center shadow-sm">
                <div className="w-16 h-16 bg-[#8b1818] text-white rounded-sm flex items-center justify-center mx-auto mb-4 text-2xl font-extrabold shadow-md">
                  {userInitial}
                </div>
                <h3 className="font-extrabold text-gray-800 text-lg uppercase tracking-wide">{user.name}</h3>
                <p className="text-xs text-gray-500 font-medium mt-1 truncate">{user.email}</p>
              </div>

              <nav className="space-y-3">
                <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center justify-between font-extrabold py-3.5 px-5 rounded-sm transition-all duration-300 text-sm uppercase tracking-wider shadow-sm border-[2px] ${activeTab === 'orders' ? 'bg-[#8b1818] text-white border-[#8b1818]' : 'bg-white text-gray-600 border-transparent hover:border-[#f7941d] hover:text-[#8b1818]'}`}>
                  <span className="flex items-center gap-3"><Package className="w-4 h-4" /> My Orders</span>
                  {activeTab === 'orders' && <ChevronRight className="w-4 h-4" />}
                </button>
                
                <button onClick={() => setActiveTab('addresses')} className={`w-full flex items-center justify-between font-extrabold py-3.5 px-5 rounded-sm transition-all duration-300 text-sm uppercase tracking-wider shadow-sm border-[2px] ${activeTab === 'addresses' ? 'bg-[#8b1818] text-white border-[#8b1818]' : 'bg-white text-gray-600 border-transparent hover:border-[#f7941d] hover:text-[#8b1818]'}`}>
                  <span className="flex items-center gap-3"><MapPin className="w-4 h-4" /> Addresses</span>
                  {activeTab === 'addresses' && <ChevronRight className="w-4 h-4" />}
                </button>

                <div className="pt-6 mt-6 border-t border-gray-100">
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 text-red-500 hover:bg-red-50 font-extrabold py-3.5 px-5 rounded-sm transition-colors border border-transparent hover:border-red-100 text-sm uppercase tracking-wider">
                    <LogOut className="w-4 h-4" /> Secure Logout
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* =========================================
              RIGHT SIDE: DYNAMIC CONTENT AREA
          ========================================= */}
          <div className="lg:w-3/4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            
            {/* 🟢 TAB: MY ORDERS */}
            {activeTab === 'orders' && (
              <div>
                {/* ... (Orders wala same section from previous code) ... */}
                <h2 className="text-2xl font-extrabold text-gray-800 mb-6 uppercase tracking-wide flex items-center gap-2">
                  <Package className="w-6 h-6 text-[#f7941d]" /> Order History
                </h2>

                {loading && (
                  <div className="space-y-6">
                    {[1, 2].map((n) => (
                      <div key={n} className="bg-white h-48 rounded-sm animate-pulse border border-orange-50 shadow-sm p-6">
                        <div className="w-1/3 h-6 bg-gray-200 mb-4 rounded-sm"></div>
                        <div className="w-full h-20 bg-gray-100 rounded-sm"></div>
                      </div>
                    ))}
                  </div>
                )}
                
                {error && (
                  <div className="bg-red-50 p-6 rounded-sm shadow-sm border border-red-100 text-red-600 font-bold text-center">
                    {error}
                  </div>
                )}

                {!loading && !error && orders.length === 0 && (
                  <div className="bg-white p-16 rounded-sm shadow-sm border border-orange-50 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-[#fffbf4] border border-orange-100 rounded-sm flex items-center justify-center mb-6 transform rotate-3">
                      <ShoppingBag className="w-10 h-10 text-[#f7941d]" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-800 mb-2 uppercase tracking-wide">No Orders Yet</h2>
                    <p className="text-gray-500 mb-8 font-medium">You haven't placed any pooja samagri orders.</p>
                    <Link to="/shop" className="bg-transparent border-[2px] border-[#8b1818] text-[#8b1818] hover:bg-[#8b1818] hover:text-white font-extrabold py-3.5 px-10 rounded-sm shadow-sm transition-all active:scale-95 uppercase tracking-wider">
                      Start Shopping
                    </Link>
                  </div>
                )}

                {!loading && !error && orders.length > 0 && (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-white rounded-sm shadow-sm border border-orange-100 overflow-hidden hover:shadow-[0_10px_25px_rgba(139,24,24,0.08)] transition-all duration-300">
                        <div className="bg-[#fffbf4] p-5 md:p-6 border-b border-orange-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex flex-wrap gap-8">
                            <div>
                              <p className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest mb-1">Order Placed</p>
                              <p className="font-bold text-gray-800">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest mb-1">Total Amount</p>
                              <p className="font-extrabold text-[#c21820] text-lg">₹{order.totalAmount}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest mb-1">Order ID</p>
                              <p className="font-bold text-gray-800">#ARP_{order.id.toString().padStart(5, '0')}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col md:items-end gap-3">
                            {getStatusBadge(order.status)}
                            <Link to="/track-order" className="flex items-center gap-1.5 text-sm font-extrabold text-[#f7941d] hover:text-[#c21820] transition-colors uppercase tracking-wider">
                              <Truck className="w-4 h-4" /> Track Order
                            </Link>
                          </div>
                        </div>

                        <div className="p-5 md:p-6 space-y-4">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-5">
                              <div className="w-20 h-20 bg-[#fcfaf5] rounded-sm border border-orange-50 overflow-hidden flex-shrink-0">
                                <img src={item.product?.imageUrl || "https://dummyimage.com/300x300/fcfaf5/8b1818.jpg"} alt="Product" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-grow">
                                <h4 className="font-extrabold text-gray-800 hover:text-[#c21820] transition-colors cursor-pointer line-clamp-1" onClick={() => navigate(`/product/${item.product?.id}`)}>
                                  {item.product?.title || "Pooja Item"}
                                </h4>
                                <p className="text-sm text-gray-500 font-medium mt-1">₹{item.price} <span className="mx-1 text-xs">x</span> {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-extrabold text-gray-800">₹{item.price * item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 🟢 TAB: SAVED ADDRESSES (Real Database Fetched) */}
            {activeTab === 'addresses' && (
              <div className="animate-fade-up">
                <h2 className="text-2xl font-extrabold text-gray-800 mb-6 uppercase tracking-wide flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-[#f7941d]" /> Saved Addresses
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Map Existing Addresses */}
                  {!loading && addresses.map((addr, index) => (
                    <div key={addr.id} className={`bg-white p-6 rounded-sm shadow-sm relative group transition-all duration-300 hover:shadow-[0_10px_20px_rgba(139,24,24,0.06)] border-[2px] ${index === 0 ? 'border-[#8b1818]' : 'border-gray-100 hover:border-orange-200'}`}>
                      {index === 0 && <span className="absolute top-0 right-0 bg-[#8b1818] text-white text-[9px] font-extrabold px-3 py-1.5 rounded-bl-sm uppercase tracking-widest shadow-sm">Recent</span>}
                      
                      <h4 className="font-extrabold text-gray-800 mb-3 flex items-center gap-2 tracking-wide">
                        <User className="w-4 h-4 text-[#f7941d]"/> {addr.fullName}
                      </h4>
                      <div className="text-gray-600 text-sm leading-relaxed mb-6 font-medium space-y-1">
                        <p className="flex items-start gap-2"><Home className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"/> {addr.street}</p>
                        <p className="ml-6">{addr.city}, {addr.state} - {addr.pincode}</p>
                        <p className="ml-6 font-bold text-gray-800 pt-1">Phone: {addr.phone}</p>
                      </div>
                      
                      <div className="flex gap-4 border-t border-gray-100 pt-4 mt-auto">
                        <button className="text-[11px] font-extrabold text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors ml-auto">Remove</button>
                      </div>
                    </div>
                  ))}

                  {/* Add New Address Button */}
                  <div 
                    onClick={() => setIsAddressModalOpen(true)}
                    className="bg-[#fffbf4] p-6 rounded-sm border-2 border-dashed border-orange-200 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-orange-50 hover:border-[#f7941d] transition-all duration-300 min-h-[220px] group"
                  >
                    <div className="w-12 h-12 bg-white rounded-sm flex items-center justify-center shadow-sm text-[#f7941d] group-hover:bg-[#f7941d] group-hover:text-white transition-colors mb-4 transform group-hover:-translate-y-1">
                      <span className="text-2xl font-light leading-none">+</span>
                    </div>
                    <p className="font-extrabold text-gray-600 group-hover:text-[#8b1818] uppercase tracking-wide text-sm">Add New Address</p>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;