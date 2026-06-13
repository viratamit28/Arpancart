import React, { useState } from 'react';
import axios from 'axios';
import { 
  Search, Package, Truck, CheckCircle2, AlertCircle, 
  ShoppingBag, Loader2, Clock, MapPin, XCircle, Sparkles 
} from 'lucide-react';

const TrackOrder = () => {
  const [trackingId, setTrackingId] = useState('');
  const [trackingStatus, setTrackingStatus] = useState('idle'); // idle, loading, found, error
  const [orderData, setOrderData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const API_BASE_URL = 'https://arpancart-production.up.railway.app/api';

  // Order Timeline Steps
  const orderSteps = [
    { status: 'PENDING', label: 'Order Placed', icon: Clock, desc: 'We have received your order' },
    { status: 'CONFIRMED', label: 'Processing', icon: Package, desc: 'Items are being packed' },
    { status: 'SHIPPED', label: 'Shipped', icon: Truck, desc: 'Out for delivery' },
    { status: 'DELIVERED', label: 'Delivered', icon: CheckCircle2, desc: 'Safely delivered' }
  ];

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setTrackingStatus('loading');
    setErrorMessage('');
    
    // 🔥 SMART FIX: Agar user "ARP_00015" daale, toh sirf "15" nikalega.
    const cleanId = trackingId.replace(/[^0-9]/g, '');

    if (!cleanId) {
      setTrackingStatus('error');
      setErrorMessage("Please enter a valid numeric Order ID.");
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/orders/track/${cleanId}`);
      
      if (response.data.success) {
        setOrderData(response.data.data);
        setTrackingStatus('found');
      }
    } catch (error) {
      console.error("Tracking Error:", error);
      setTrackingStatus('error');
      setErrorMessage(error.response?.data?.message || 'Order not found. Please check your Order ID.');
    }
  };

  // Helper function to get current step
  const getCurrentStepIndex = (status) => {
    if (!status) return 0;
    const upperStatus = status.toUpperCase();
    if (upperStatus === 'CANCELLED') return -1;
    return orderSteps.findIndex(step => step.status === upperStatus);
  };

  return (
    <div className="bg-gradient-to-b from-[#fcfaf5] to-white min-h-screen py-16 px-4 md:px-8 relative overflow-hidden font-sans">
      
      {/* Background Decorative Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-100/40 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-4xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-12 animate-[fadeIn_0.6s_ease-out]">
          <div className="flex justify-center items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-[#f7941d]" />
            <span className="text-xs font-extrabold text-[#f7941d] uppercase tracking-widest">Real-time Updates</span>
            <Sparkles className="w-5 h-5 text-[#f7941d]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8b1818] to-[#d63031] tracking-tight uppercase mb-4">
            Track Your Order
          </h1>
          <p className="text-gray-500 font-medium text-sm md:text-base max-w-lg mx-auto">
            Enter your Order ID below to check the current status and exact location of your divine package.
          </p>
        </div>

        {/* SEARCH BOX */}
        <div className="bg-white/80 backdrop-blur-md p-4 md:p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white mb-10 transition-all hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)]">
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="e.g. ARP_00015 or just 15" 
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                required
                className="w-full pl-14 pr-4 py-4 md:py-5 border-2 border-gray-100 rounded-2xl outline-none focus:border-[#f7941d] focus:bg-white bg-gray-50/50 transition-all font-bold text-gray-800 text-lg tracking-wide placeholder:font-medium placeholder:text-gray-400"
              />
            </div>
            <button 
              type="submit"
              disabled={trackingStatus === 'loading'}
              className="bg-gradient-to-r from-[#8b1818] to-[#b32424] hover:shadow-[0_8px_20px_rgba(139,24,24,0.25)] text-white px-8 py-4 md:py-5 rounded-2xl font-extrabold uppercase tracking-widest text-sm transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 min-w-[180px]"
            >
              {trackingStatus === 'loading' ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Fetching</>
              ) : (
                'Track Now'
              )}
            </button>
          </form>
        </div>

        {/* ERROR STATE */}
        {trackingStatus === 'error' && (
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-700 p-6 rounded-2xl flex items-center gap-4 shadow-sm animate-[fadeIn_0.4s_ease-out]">
            <div className="bg-red-100 p-2 rounded-full">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            </div>
            <div>
              <h4 className="font-bold text-red-800">Tracking Failed</h4>
              <p className="font-medium text-sm text-red-600 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* TRACKING RESULTS */}
        {trackingStatus === 'found' && orderData && (
          <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
            
            {/* Header Info Card */}
            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-orange-50 flex flex-col sm:flex-row justify-between sm:items-center gap-6">
              <div>
                <p className="text-[11px] text-gray-400 font-extrabold uppercase tracking-widest mb-1">Order Number</p>
                <p className="text-2xl font-black text-gray-900 tracking-tight">#ARP_{orderData.id.toString().padStart(5, '0')}</p>
                <p className="text-xs text-gray-500 font-medium mt-1">Placed on {new Date(orderData.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              
              <div className="sm:text-right flex flex-row sm:flex-col justify-between items-center sm:items-end border-t sm:border-t-0 border-gray-100 pt-4 sm:pt-0">
                <div>
                  <p className="text-[11px] text-gray-400 font-extrabold uppercase tracking-widest mb-1 sm:mb-0">Total Amount</p>
                  <p className="text-2xl font-black text-[#8b1818]">₹{orderData.totalAmount}</p>
                </div>
                <div className="mt-2">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                    orderData.status?.toUpperCase() === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                    orderData.status?.toUpperCase() === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                    'bg-orange-100 text-[#f7941d]'
                  }`}>
                    {orderData.status || 'PENDING'}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline Progress Card */}
            <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-orange-50">
              
              {orderData.status?.toUpperCase() === 'CANCELLED' ? (
                 <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-center gap-4">
                 <XCircle className="w-10 h-10 text-red-500" />
                 <div>
                   <h3 className="font-extrabold text-red-800 text-lg">Order Cancelled</h3>
                   <p className="text-sm text-red-600 font-medium mt-1">This order has been cancelled and will not be delivered.</p>
                 </div>
               </div>
              ) : (
                <div className="relative">
                  {/* Vertical Progress Line (Mobile) */}
                  <div className="absolute left-6 top-8 bottom-8 w-1 bg-gray-100 rounded-full md:hidden"></div>
                  
                  {/* Horizontal Progress Line (Desktop) */}
                  <div className="hidden md:block absolute left-[10%] right-[10%] top-6 h-1.5 bg-gray-100 rounded-full"></div>

                  {/* Active Progress Line Fill (Desktop) */}
                  <div 
                    className="hidden md:block absolute left-[10%] top-6 h-1.5 bg-gradient-to-r from-[#f7941d] to-green-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(getCurrentStepIndex(orderData.status) / (orderSteps.length - 1)) * 80}%` }}
                  ></div>

                  <div className="flex flex-col gap-10 md:flex-row md:justify-between relative z-10">
                    {orderSteps.map((step, index) => {
                      const currentIndex = getCurrentStepIndex(orderData.status);
                      const isCompleted = index <= currentIndex;
                      const isCurrent = index === currentIndex;
                      const StepIcon = step.icon;

                      return (
                        <div key={index} className="flex md:flex-col items-start md:items-center relative group w-full md:w-1/4">
                          
                          {/* Active Progress Line Fill (Mobile) */}
                          {index !== orderSteps.length - 1 && (
                            <div className={`md:hidden absolute left-6 top-12 bottom-[-2.5rem] w-1 rounded-full transition-colors duration-700 ${index < currentIndex ? 'bg-gradient-to-b from-[#f7941d] to-green-500' : 'bg-transparent'}`}></div>
                          )}

                          {/* Icon Circle */}
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 border-[4px] z-10 transition-all duration-500 ${
                            isCompleted 
                              ? 'bg-white border-[#f7941d] text-[#f7941d] shadow-[0_0_20px_rgba(247,148,29,0.3)]' 
                              : 'bg-white border-gray-100 text-gray-300'
                          } ${isCurrent ? 'scale-110' : ''}`}>
                            <StepIcon className={`w-6 h-6 ${isCurrent ? 'animate-pulse' : ''} ${isCompleted && index === orderSteps.length - 1 ? 'text-green-500' : ''}`} />
                          </div>
                          
                          {/* Text Info */}
                          <div className="ml-6 md:ml-0 md:mt-5 pt-3 md:pt-0 md:text-center">
                            <h4 className={`text-[15px] font-extrabold uppercase tracking-wide mb-1 transition-colors ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                              {step.label}
                            </h4>
                            <p className={`text-xs font-medium ${isCompleted ? 'text-gray-500' : 'text-gray-300'}`}>
                              {step.desc}
                            </p>
                            {/* Timestamp (Show only for placed order for now, or if backend provides step times) */}
                            {index === 0 && (
                              <p className="text-[10px] text-gray-400 font-bold mt-2">
                                {new Date(orderData.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Address & Order Summary Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Shipping Address */}
              <div className="lg:col-span-1 bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-orange-50">
                <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#8b1818]" /> Shipping Details
                </h3>
                <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100">
                  <p className="text-sm text-gray-700 font-semibold leading-relaxed">
                    {orderData.shippingAddress}
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-1">Payment Mode</p>
                  <p className="text-sm font-black text-gray-800">{orderData.paymentMethod || 'Cash on Delivery (COD)'}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-orange-50">
                <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#8b1818]" /> Items Ordered
                </h3>
                
                <div className="space-y-4">
                  {orderData.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-5 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50 hover:border-orange-200 transition-colors">
                      <div className="w-20 h-20 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex-shrink-0 p-1">
                        <img 
                          src={item.product?.imageUrl || "https://placehold.co/300"} 
                          alt={item.product?.title} 
                          className="w-full h-full object-cover rounded-lg" 
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-extrabold text-gray-900 text-sm md:text-base line-clamp-1">{item.product?.title || 'Divine Product'}</h4>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="bg-white border border-gray-200 text-gray-600 text-[10px] font-extrabold px-3 py-1 rounded-full">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-gray-400 text-xs font-bold">× ₹{item.price}</span>
                        </div>
                      </div>
                      <div className="text-right pl-4">
                        <p className="font-black text-[#8b1818] text-lg">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default TrackOrder;