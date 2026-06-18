import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { MapPin, Phone, User as UserIcon, Mail, Building, Hash, CreditCard, ShieldCheck, Loader2, Tag, X, Sparkles, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, setCartItems } = useContext(CartContext);
  
  const [loading, setLoading] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);
  const [pinError, setPinError] = useState(''); 

  // =========================================
  // 🔥 COUPON STATES
  // =========================================
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [couponMessage, setCouponMessage] = useState({ type: '', text: '' });

  // =========================================
  // 📝 FORM STATE
  // =========================================
  const [shippingData, setShippingData] = useState({
    fullName: '', email: '', phone: '', address: '', city: '', state: '', zipCode: ''
  });

  const API_BASE_URL = 'https://arpancart-production.up.railway.app/api';

  // =========================================
  // 🧮 ADVANCED MATH CALCULATIONS
  // =========================================
  const itemsTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalDeliveryFee = cartItems.reduce((acc, item) => acc + (Number(item.deliveryCharge || 0) * item.quantity), 0);
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  
  const finalTotalAmount = itemsTotal + totalDeliveryFee - discountAmount;

  // =========================================
  // 🔄 INITIAL LOAD
  // =========================================
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => setShippingData({ ...shippingData, [e.target.name]: e.target.value });

  // =========================================
  // 🎟️ COUPON LOGIC
  // =========================================
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsApplying(true);
    setCouponMessage({ type: '', text: '' });
    try {
      const res = await axios.post(`${API_BASE_URL}/apply-coupon`, { code: couponInput, cartTotal: itemsTotal });
      if (res.data.success) {
        setAppliedCoupon(res.data.data);
        setCouponMessage({ type: 'success', text: res.data.message || 'Coupon Applied Successfully! 🎉' });
        setCouponInput(''); 
      }
    } catch (error) {
      setCouponMessage({ type: 'error', text: error.response?.data?.message || 'Invalid or Expired Coupon' });
    } finally { setIsApplying(false); }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponMessage({ type: '', text: '' });
  };

  // =========================================
  // 📍 PIN CODE AUTO-DETECT (Patna Only)
  // =========================================
  const handlePinChange = async (e) => {
    const pin = e.target.value;
    if (pin.length <= 6 && /^[0-9]*$/.test(pin)) {
      setShippingData({ ...shippingData, zipCode: pin });
      setPinError(''); 
      
      if (pin.length === 6) {
        setPinLoading(true);
        try {
          const response = await axios.get(`https://api.postalpincode.in/pincode/${pin}`);
          const data = response.data[0];
          
          if (data.Status === "Success") {
            const postOffice = data.PostOffice[0];
            const fetchedDistrict = postOffice.District;

            if (fetchedDistrict.toLowerCase() === "patna") {
              setPinError(''); 
              setShippingData(prev => ({ ...prev, city: postOffice.District, state: postOffice.State }));
            } else {
              setPinError(`Sorry! We currently deliver only in Patna. Your PIN is for ${fetchedDistrict}.`);
              setShippingData(prev => ({ ...prev, city: '', state: '' }));
            }
          } else {
             setPinError("Invalid PIN Code. Please check again.");
             setShippingData(prev => ({ ...prev, city: '', state: '' }));
          }
        } catch (error) {
          setPinError("Error fetching location. Please try again.");
        } finally {
          setPinLoading(false);
        }
      }
    }
  };

  // =========================================
  // 🚀 PLACE ORDER LOGIC (SPLIT CART)
  // =========================================
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (pinError || shippingData.city.toLowerCase() !== 'patna') {
      alert("Please enter a valid Patna PIN code to place the order.");
      return; 
    }

    setLoading(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert("Please login to place an order.");
      navigate('/login');
      setLoading(false);
      return;
    }

    let userId = null;
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      userId = decodedPayload.id || decodedPayload.userId;
    } catch (err) {
      console.error("Token decoding failed", err);
    }

    try {
      const subscriptionItems = cartItems.filter(item => item.isSubscription);
      const regularItems = cartItems.filter(item => !item.isSubscription);

      if (regularItems.length > 0) {
        const orderPayload = {
          items: regularItems.map(item => ({ 
            productId: parseInt(item.id), 
            quantity: parseInt(item.quantity), 
            price: parseFloat(item.price) 
          })),
          totalAmount: parseFloat(finalTotalAmount), 
          shippingAddress: `${shippingData.fullName}, ${shippingData.address}, ${shippingData.city}, ${shippingData.state} - ${shippingData.zipCode}. Phone: ${shippingData.phone}`
        };

        await axios.post(`${API_BASE_URL}/orders`, orderPayload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      if (subscriptionItems.length > 0) {
        for (const sub of subscriptionItems) {
          const numericPlanId = parseInt(sub.id.replace(/[^0-9]/g, '')) || 1;

          await axios.post(`${API_BASE_URL}/subscriptions/create`, {
            userId: parseInt(userId), 
            planId: numericPlanId,
            startDate: sub.startDate,
            durationDays: parseInt(sub.durationDays)
          });
        }
      }

      if (saveAddress) {
        localStorage.setItem('arpancart_saved_address', JSON.stringify(shippingData));
      } else {
        localStorage.removeItem('arpancart_saved_address');
      }

      alert("🎉 Order Placed Successfully! Jai Shree Ram!");
      if (setCartItems) setCartItems([]);
      navigate('/dashboard'); 

    } catch (error) {
      console.error("Order failed:", error);
      alert("Something went wrong while placing the order.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // 🚫 EMPTY CART UI
  // =========================================
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] bg-[#fcfaf5] flex flex-col items-center justify-center px-4">
        <div className="bg-white p-12 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-orange-50 flex flex-col items-center text-center max-w-md w-full">
          <h2 className="text-3xl font-extrabold text-[#8b1818] mb-4">Cart is Empty</h2>
          <p className="text-gray-500 font-medium mb-8">Add some items to proceed to checkout.</p>
          <Link to="/shop" className="w-full bg-gradient-to-r from-[#f7941d] to-[#e0861a] text-white font-extrabold py-4 px-8 rounded-xl shadow-md uppercase tracking-wider transition-transform active:scale-95">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfaf5] min-h-screen py-12 px-4 md:px-8 lg:px-12">
      
      <style>
        {`
          @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-up { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: #fffbf4; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #f7941d; border-radius: 4px; }
        `}
      </style>

      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-12 animate-fade-up">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#8b1818] mb-3 tracking-wide uppercase">Secure Checkout</h1>
          <p className="text-gray-500 font-bold flex items-center justify-center gap-2 text-sm">
            <ShieldCheck className="w-5 h-5 text-green-600" /> 100% Safe and Secure Payments
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* =========================================
              📦 LEFT SIDE: SHIPPING FORM
          ========================================= */}
          <div className="w-full lg:w-2/3 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white p-6 md:p-10 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-orange-50 relative">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#f7941d] to-[#8b1818] rounded-t-2xl"></div>
              
              <h2 className="text-2xl font-extrabold text-gray-800 border-b border-gray-100 pb-5 mb-8 flex items-center gap-3 uppercase tracking-wide">
                <MapPin className="w-6 h-6 text-[#f7941d]" /> Shipping Details
              </h2>

              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-1.5">Full Name</label>
                    <div className="absolute bottom-3 left-4 pointer-events-none"><UserIcon className="h-5 w-5 text-gray-400 group-focus-within:text-[#f7941d] transition-colors" /></div>
                    <input type="text" name="fullName" required value={shippingData.fullName} onChange={handleChange} className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#f7941d] focus:ring-2 focus:ring-orange-100 bg-gray-50 focus:bg-white transition-all text-sm font-bold text-gray-800" />
                  </div>
                  <div className="relative group">
                    <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-1.5">Email Address</label>
                    <div className="absolute bottom-3 left-4 pointer-events-none"><Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#f7941d] transition-colors" /></div>
                    <input type="email" name="email" required value={shippingData.email} onChange={handleChange} className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#f7941d] focus:ring-2 focus:ring-orange-100 bg-gray-50 focus:bg-white transition-all text-sm font-bold text-gray-800" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-1.5">Phone Number</label>
                    <div className="absolute bottom-3 left-4 pointer-events-none"><Phone className="h-5 w-5 text-gray-400 group-focus-within:text-[#f7941d] transition-colors" /></div>
                    <input type="tel" name="phone" required value={shippingData.phone} onChange={handleChange} className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#f7941d] focus:ring-2 focus:ring-orange-100 bg-gray-50 focus:bg-white transition-all text-sm font-bold text-gray-800" />
                  </div>
                  <div className="relative group">
                    <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-1.5">Flat No. / Street Address</label>
                    <div className="absolute bottom-3 left-4 pointer-events-none"><Building className="h-5 w-5 text-gray-400 group-focus-within:text-[#f7941d] transition-colors" /></div>
                    <input type="text" name="address" required value={shippingData.address} onChange={handleChange} className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#f7941d] focus:ring-2 focus:ring-orange-100 bg-gray-50 focus:bg-white transition-all text-sm font-bold text-gray-800" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative mb-6">
                  <div className="relative group">
                    <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-1.5">PIN Code (Patna)</label>
                    <div className="absolute bottom-3 left-4 pointer-events-none"><Hash className="h-5 w-5 text-gray-400 group-focus-within:text-[#f7941d] transition-colors" /></div>
                    <input type="text" name="zipCode" maxLength="6" required value={shippingData.zipCode} onChange={handlePinChange} className={`w-full pl-12 pr-10 py-3 border rounded-xl outline-none transition-all text-sm font-bold ${pinError ? 'border-red-500 ring-2 ring-red-100 bg-red-50 text-red-700' : shippingData.zipCode.length === 6 ? 'border-green-400 ring-2 ring-green-100 bg-green-50 text-green-800' : 'border-gray-200 focus:border-[#f7941d] bg-gray-50 focus:bg-white text-gray-800'}`} />
                    {pinLoading && <div className="absolute bottom-3 right-4 pointer-events-none"><Loader2 className="h-5 w-5 text-[#f7941d] animate-spin" /></div>}
                    {pinError && <p className="text-red-500 text-[11px] mt-1.5 font-extrabold absolute -bottom-5 left-0 w-[200%]">{pinError}</p>}
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-1.5">City</label>
                    <input type="text" name="city" required readOnly value={shippingData.city} className={`w-full px-4 py-3 border rounded-xl outline-none transition-all text-sm font-bold ${shippingData.city ? 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed' : 'bg-gray-50 border-gray-200 cursor-not-allowed text-gray-400'}`} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-1.5">State</label>
                    <input type="text" name="state" required readOnly value={shippingData.state} className={`w-full px-4 py-3 border rounded-xl outline-none transition-all text-sm font-bold ${shippingData.state ? 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed' : 'bg-gray-50 border-gray-200 cursor-not-allowed text-gray-400'}`} />
                  </div>
                </div>

                <div className="flex items-center mt-8 bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                  <input type="checkbox" id="saveAddress" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} className="w-4 h-4 text-[#f7941d] border-gray-300 rounded focus:ring-[#f7941d] cursor-pointer" />
                  <label htmlFor="saveAddress" className="ml-3 block text-sm font-extrabold text-gray-700 cursor-pointer uppercase tracking-widest">Save address for future orders</label>
                </div>

                <div className="pt-6 border-t border-gray-100 mt-6">
                  <h3 className="text-sm font-extrabold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> Payment Method
                  </h3>
                  <div className="flex items-center p-5 border-2 border-[#8b1818] rounded-xl bg-red-50/50 cursor-pointer shadow-sm relative overflow-hidden">
                    <div className="absolute left-0 top-0 h-full w-1 bg-[#8b1818]"></div>
                    <input type="radio" id="cod" name="payment" defaultChecked className="w-5 h-5 text-[#8b1818] focus:ring-[#8b1818]" />
                    <label htmlFor="cod" className="ml-3 font-extrabold text-[#8b1818] cursor-pointer w-full text-lg uppercase tracking-wide">Cash on Delivery (COD)</label>
                  </div>
                </div>

              </form>
            </div>
          </div>

          {/* =========================================
              🧾 RIGHT SIDE: ORDER SUMMARY
          ========================================= */}
          <div className="w-full lg:w-1/3 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-orange-100 sticky top-24">
              
              {/* 🔥 PROMO CODE SECTION */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <h3 className="text-sm font-extrabold text-[#8b1818] uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Tag className="w-4 h-4" /> Apply Promo Code
                </h3>
                
                {!appliedCoupon ? (
                  <div>
                    <div className="flex gap-2">
                      <input type="text" value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#f7941d] focus:bg-orange-50/30 uppercase font-black tracking-widest transition-colors" />
                      <button onClick={handleApplyCoupon} disabled={isApplying || !couponInput} className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all disabled:opacity-50 shadow-md">
                        {isApplying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                      </button>
                    </div>
                    {couponMessage.text && (
                      <p className={`text-[11px] font-extrabold mt-3 flex items-center gap-1 uppercase tracking-wider ${couponMessage.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                        {couponMessage.type === 'error' ? <X className="w-3 h-3"/> : <CheckCircle2 className="w-3 h-3"/>} {couponMessage.text}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 p-4 rounded-xl flex justify-between items-center shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                    <div>
                      <p className="text-[10px] text-green-700 font-extrabold uppercase tracking-widest mb-1 flex items-center gap-1"><Sparkles className="w-3 h-3"/> Code Applied</p>
                      <p className="text-base font-black text-gray-900 tracking-wider">{appliedCoupon.couponCode}</p>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                  </div>
                )}
              </div>

              {/* 🧾 ITEM LIST */}
              <h2 className="text-lg font-extrabold text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-4 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-16 h-16 bg-[#fcfaf5] rounded-lg border border-orange-50 overflow-hidden flex-shrink-0">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-extrabold text-gray-800 text-sm line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-gray-500 font-bold mt-1 uppercase">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-[#8b1818]">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 💵 BILL CALCULATIONS */}
              <div className="space-y-4 text-sm font-bold text-gray-600 mb-6 border-t border-gray-100 pt-6">
                <div className="flex justify-between items-center">
                  <span>Items Total</span><span className="text-gray-900 font-black">₹{itemsTotal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Shipping Fee</span>
                  <span className={`font-black ${totalDeliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>{totalDeliveryFee === 0 ? 'FREE' : `+ ₹${totalDeliveryFee}`}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between items-center text-green-600 bg-green-50 p-2 rounded-md -mx-2 px-2">
                    <span>Coupon Discount</span><span className="font-black">- ₹{discountAmount}</span>
                  </div>
                )}
              </div>

              {/* FINAL AMOUNT */}
              <div className="bg-[#fffbf4] p-5 rounded-xl border border-orange-100 mb-8 relative overflow-hidden shadow-inner">
                <div className="flex justify-between items-end relative z-10">
                  <span className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">To Pay</span>
                  <div className="text-right">
                    <span className="text-4xl font-black text-[#c21820] tracking-tighter">₹{finalTotalAmount}</span>
                  </div>
                </div>
              </div>

              {/* CHECKOUT BUTTON */}
              <button 
                type="submit" 
                form="checkout-form" 
                disabled={loading || pinLoading || pinError !== ''} 
                className={`w-full flex items-center justify-center gap-3 text-white font-extrabold text-sm uppercase tracking-widest py-4 rounded-xl shadow-md transition-all duration-300 ${loading || pinError !== '' ? 'bg-gray-400 cursor-not-allowed opacity-80' : 'bg-gradient-to-r from-[#f7941d] to-[#e0861a] hover:from-[#e0861a] hover:to-[#c26f12] shadow-[0_8px_20px_rgba(247,148,29,0.3)] active:scale-95'}`}
              >
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Placing Order...</> : 'Confirm & Place Order'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;