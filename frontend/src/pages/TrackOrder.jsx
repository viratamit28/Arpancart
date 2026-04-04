import React, { useState } from 'react';
import axios from 'axios';
import { Search, Package, Truck, CheckCircle, AlertCircle, ShoppingBag } from 'lucide-react';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [trackingStatus, setTrackingStatus] = useState(null); // null, 'loading', 'found', 'error'
  const [orderData, setOrderData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    
    setTrackingStatus('loading');
    setErrorMessage('');
    
    try {
      // Asli Backend API call
      const response = await axios.get(`https://arpancart.onrender.com/api/orders/track/${orderId}`);
      
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

  // Status mapping logic
  const currentStatus = orderData?.status || "Pending";
  const isProcessing = currentStatus === "Processing" || currentStatus === "Shipped" || currentStatus === "Delivered";
  const isShipped = currentStatus === "Shipped" || currentStatus === "Delivered";
  const isDelivered = currentStatus === "Delivered";

  return (
    <div className="bg-[#fcfaf5] min-h-screen py-16 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-12 mt-4">
          <div className="flex items-center justify-center mb-6">
            <div className="hidden md:flex items-center">
              <div className="w-12 lg:w-24 h-[1px] bg-[#8b1818] opacity-40"></div>
              <div className="w-1.5 h-1.5 bg-[#8b1818] transform rotate-45 mx-1.5 opacity-60"></div>
            </div>
            <h1 className="text-4xl font-extrabold text-[#8b1818] px-6 uppercase tracking-wide">
              Track Your Order
            </h1>
            <div className="hidden md:flex items-center">
              <div className="w-1.5 h-1.5 bg-[#8b1818] transform rotate-45 mx-1.5 opacity-60"></div>
              <div className="w-12 lg:w-24 h-[1px] bg-[#8b1818] opacity-40"></div>
            </div>
          </div>
          <p className="text-gray-600 font-medium">Enter your Order ID below to get real-time tracking updates.</p>
        </div>

        {/* SEARCH BOX */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-orange-50 mb-10">
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="number" 
                placeholder="Enter Order ID (e.g. 5)" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] bg-gray-50 focus:bg-white transition-all font-medium text-lg tracking-wider"
              />
            </div>
            <button 
              type="submit"
              disabled={trackingStatus === 'loading'}
              className="bg-[#f7941d] hover:bg-[#e0861a] text-white px-8 py-4 rounded-lg font-bold text-lg shadow-md transition-all active:scale-95 disabled:opacity-70"
            >
              {trackingStatus === 'loading' ? 'Tracking...' : 'Track Now'}
            </button>
          </form>
        </div>

        {/* ERROR STATE */}
        {trackingStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl flex items-center justify-center gap-3">
            <AlertCircle className="w-6 h-6" />
            <p className="font-bold text-lg">{errorMessage}</p>
          </div>
        )}

        {/* TRACKING RESULTS (Timeline & Products) */}
        {trackingStatus === 'found' && orderData && (
          <div className="space-y-6">
            
            {/* Timeline Card */}
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-orange-50">
              <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                <div>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Order ID</p>
                  <p className="text-2xl font-extrabold text-[#8b1818]">#{orderData.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Total Amount</p>
                  <p className="text-2xl font-extrabold text-[#c21820]">₹{orderData.totalAmount}</p>
                </div>
              </div>

              {/* Vertical Timeline */}
              <div className="relative pl-8 space-y-10">
                {/* Timeline Line */}
                <div className="absolute left-10 top-2 bottom-2 w-1 bg-orange-100"></div>
                <div className={`absolute left-10 top-2 w-1 transition-all duration-1000 bg-[#f7941d] ${isDelivered ? 'h-full' : isShipped ? 'h-2/3' : isProcessing ? 'h-1/3' : 'h-0'}`}></div>

                {/* Step 1: Order Confirmed (Always true if order exists) */}
                <div className="relative flex items-start gap-6">
                  <div className="absolute -left-5 bg-[#f7941d] w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">Order Placed</h4>
                    <p className="text-sm text-gray-500 mt-1">{new Date(orderData.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                {/* Step 2: Processing */}
                <div className={`relative flex items-start gap-6 ${isProcessing ? '' : 'opacity-40'}`}>
                  <div className={`absolute -left-5 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 ${isProcessing ? 'bg-[#f7941d]' : 'bg-gray-300'}`}>
                    <Package className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">Processing</h4>
                    <p className="text-sm text-gray-500 mt-1">Your pooja samagri is being packed with purity.</p>
                  </div>
                </div>

                {/* Step 3: Shipped */}
                <div className={`relative flex items-start gap-6 ${isShipped ? '' : 'opacity-40'}`}>
                  <div className={`absolute -left-6 w-8 h-8 rounded-full flex items-center justify-center z-10 ${isShipped && !isDelivered ? 'bg-white border-2 border-[#f7941d] animate-pulse' : isShipped ? 'bg-[#f7941d] border-4 border-white' : 'bg-gray-300 border-4 border-white'}`}>
                    <Truck className={`w-4 h-4 ${isShipped && !isDelivered ? 'text-[#f7941d]' : 'text-white'}`} />
                  </div>
                  <div>
                    <h4 className={`text-lg font-bold ${isShipped && !isDelivered ? 'text-[#f7941d]' : 'text-gray-800'}`}>Out for Delivery</h4>
                    <p className="text-sm text-gray-500 mt-1">Delivery executive is on the way.</p>
                  </div>
                </div>

                {/* Step 4: Delivered */}
                <div className={`relative flex items-start gap-6 ${isDelivered ? '' : 'opacity-40'}`}>
                  <div className={`absolute -left-4 w-4 h-4 rounded-full border-4 border-white z-10 ${isDelivered ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div>
                    <h4 className={`text-lg font-bold ${isDelivered ? 'text-green-600' : 'text-gray-500'}`}>Delivered</h4>
                    <p className="text-sm text-gray-500 mt-1">Order successfully completed.</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Order Items Details (Products) */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-orange-50">
              <h3 className="text-xl font-bold text-[#8b1818] mb-6 flex items-center gap-2">
                <ShoppingBag className="w-6 h-6" /> Items in this Order
              </h3>
              <div className="space-y-4">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 bg-[#fcfaf5] p-4 rounded-lg border border-orange-100">
                    <img src={item.product.imageUrl} alt={item.product.title} className="w-16 h-16 object-cover rounded-md border border-gray-200" />
                    <div className="flex-grow">
                      <h4 className="font-bold text-gray-800 line-clamp-1">{item.product.title}</h4>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default TrackOrder;