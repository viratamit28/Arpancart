import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, Truck, ShieldCheck, Tag, Loader2, X, Sparkles, CalendarDays } from 'lucide-react';
import axios from 'axios';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  // ==========================================
  // 🎟️ COUPON STATES
  // ==========================================
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [couponMessage, setCouponMessage] = useState({ type: '', text: '' });

  // ==========================================
  // 🧮 SMART CALCULATIONS
  // ==========================================
  const itemsTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalDeliveryFee = cartItems.reduce((acc, item) => acc + (Number(item.deliveryCharge || 0) * item.quantity), 0);
  
  // Discount
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  
  // Final Total (Total + Delivery - Discount)
  const finalTotalAmount = itemsTotal + totalDeliveryFee - discountAmount;

  // ==========================================
  // 🎯 ACTIONS
  // ==========================================
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsApplying(true);
    setCouponMessage({ type: '', text: '' });
    
    try {
      const res = await axios.post('https://arpancart-production.up.railway.app/api/apply-coupon', {
        code: couponInput,
        cartTotal: itemsTotal 
      });
      
      if (res.data.success) {
        setAppliedCoupon(res.data.data);
        setCouponMessage({ type: 'success', text: res.data.message || 'Coupon Applied Successfully! 🎉' });
        setCouponInput(''); 
      }
    } catch (error) {
      setCouponMessage({ type: 'error', text: error.response?.data?.message || 'Invalid or Expired Coupon' });
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponMessage({ type: '', text: '' });
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  // ==========================================
  // 🚫 EMPTY CART UI (Premium)
  // ==========================================
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] bg-[#fcfaf5] flex flex-col items-center justify-center px-4 py-12">
        <style>{`@keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } } .animate-scale-up { animation: scaleUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }`}</style>
        
        <div className="bg-white p-12 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-orange-50 flex flex-col items-center text-center max-w-lg w-full animate-scale-up relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#f7941d] to-[#8b1818]"></div>
          <div className="w-28 h-28 bg-orange-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-orange-100">
            <ShoppingBag className="w-12 h-12 text-[#f7941d]" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#8b1818] mb-3 tracking-wide">Your Cart is Empty</h2>
          <p className="text-gray-500 font-medium mb-8 text-lg">Looks like you haven't added any spiritual essentials yet.</p>
          <Link to="/shop" className="w-full bg-gradient-to-r from-[#8b1818] to-[#6e1313] hover:from-[#a01c1c] hover:to-[#8b1818] text-white font-extrabold py-4 px-8 rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest shadow-md transition-all active:scale-95">
            Start Shopping <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 md:px-8 lg:px-12 bg-[#fcfaf5] min-h-[80vh]">
      
      <style>
        {`
          @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-up { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        `}
      </style>

      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 animate-fade-up">
          <div className="flex items-center gap-3">
            <div className="bg-white p-3 rounded-full shadow-sm border border-gray-100">
              <ShoppingBag className="w-8 h-8 text-[#8b1818]" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#8b1818] tracking-wide uppercase">Shopping Cart</h1>
              <p className="text-sm font-bold text-gray-500">{cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'} in your bag</p>
            </div>
          </div>
          <Link to="/shop" className="text-[#f7941d] font-bold hover:text-[#e0861a] transition-colors flex items-center gap-1 text-sm uppercase tracking-wider">
            Continue Shopping <ArrowRight className="w-4 h-4"/>
          </Link>
        </div>

        <div className="flex flex-col xl:flex-row gap-10 items-start">
          
          {/* =========================================
              🛒 LEFT SIDE: CART ITEMS LIST
          ========================================= */}
          <div className="w-full xl:w-2/3 space-y-6">
            {cartItems.map((item, index) => {
              const itemDelivery = Number(item.deliveryCharge || 0);
              const itemTotal = (item.price * item.quantity);
              
              // Smart check to see if this is a Subscription Item
              const isSub = item.isSubscription === true;

              return (
                <div key={item.id} className="animate-fade-up flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-white p-5 md:p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-orange-50 hover:border-orange-200 transition-all group" style={{ animationDelay: `${index * 0.1}s` }}>
                  
                  {/* Item Image */}
                  <div className="w-28 h-28 md:w-36 md:h-36 rounded-xl overflow-hidden bg-[#fffbf4] flex-shrink-0 border border-orange-50 relative">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover mix-blend-multiply transition-transform group-hover:scale-110 duration-500" />
                  </div>
                  
                  {/* Item Details */}
                  <div className="flex-grow w-full">
                    <div className="flex justify-between items-start mb-2 gap-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-extrabold text-gray-800 line-clamp-2 leading-tight">{item.title}</h3>
                        
                        {/* 🚨 SMART: Render Subscription Badges or Normal Category */}
                        {isSub ? (
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="text-[10px] font-black text-white bg-gradient-to-r from-[#f7941d] to-[#e0861a] px-2 py-1 rounded-sm uppercase tracking-widest shadow-sm flex items-center gap-1">
                              <Sparkles className="w-3 h-3"/> Daily Plan
                            </span>
                            <span className="text-[10px] font-bold text-gray-600 bg-gray-100 border border-gray-200 px-2 py-1 rounded-sm flex items-center gap-1">
                              <CalendarDays className="w-3 h-3"/> Starts: {item.startDate}
                            </span>
                          </div>
                        ) : (
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Category: {item.category}</p>
                        )}
                      </div>
                      
                      <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex-shrink-0" title="Remove Item">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {/* Price & Delivery Tags */}
                    <div className="flex flex-wrap items-center gap-3 mb-4 mt-3">
                      <span className="text-sm font-black text-[#8b1818] bg-red-50 px-3 py-1.5 rounded-md border border-red-100">₹{item.price} / unit</span>
                      
                      {/* Subscription mostly has free delivery, handling dynamically */}
                      <span className={`text-[11px] font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 uppercase tracking-wider ${itemDelivery === 0 ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-orange-50 text-[#f7941d] border border-orange-100'}`}>
                        <Truck className="w-3.5 h-3.5" /> {itemDelivery === 0 ? 'Free Delivery' : `+₹${itemDelivery} Delivery`}
                      </span>
                    </div>
                    
                    {/* Quantity Controls & Item Total */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-100">
                      
                      {/* Only show quantity counter if it's NOT a subscription (Usually subscriptions are bought 1 per user) */}
                      {!isSub ? (
                        <div className="flex items-center border-[2px] border-gray-200 rounded-lg overflow-hidden bg-white w-fit">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-[#8b1818] transition-colors"><Minus className="w-4 h-4" /></button>
                          <span className="px-5 py-2 font-black text-gray-800 border-x-[2px] border-gray-200 bg-gray-50">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-green-600 transition-colors"><Plus className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <div className="text-xs font-bold text-gray-400 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                          Qty fixed for Subscriptions
                        </div>
                      )}

                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-0.5">Item Total</p>
                        <p className="text-2xl font-black text-gray-900 tracking-tight">₹{itemTotal}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* =========================================
              🧾 RIGHT SIDE: ORDER SUMMARY & COUPONS
          ========================================= */}
          <div className="w-full xl:w-1/3 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-orange-100 sticky top-28">
              
              {/* 🔥 PROMO CODE SECTION */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <h3 className="text-sm font-extrabold text-[#8b1818] uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Tag className="w-4 h-4" /> Apply Promo Code
                </h3>
                
                {!appliedCoupon ? (
                  <div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={couponInput} 
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="e.g. DIWALI50" 
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#f7941d] focus:bg-orange-50/30 uppercase font-black tracking-widest transition-colors"
                      />
                      <button 
                        onClick={handleApplyCoupon}
                        disabled={isApplying || !couponInput}
                        className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all disabled:opacity-50 shadow-md"
                      >
                        {isApplying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                      </button>
                    </div>
                    {couponMessage.text && (
                      <p className={`text-xs font-extrabold mt-3 flex items-center gap-1 ${couponMessage.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                        {couponMessage.type === 'error' ? <X className="w-3 h-3"/> : <CheckCircle2 className="w-3 h-3"/>}
                        {couponMessage.text}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 p-4 rounded-xl flex justify-between items-center shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                    <div>
                      <p className="text-[10px] text-green-700 font-extrabold uppercase tracking-widest mb-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3"/> Code Applied
                      </p>
                      <p className="text-base font-black text-gray-900 tracking-wider">{appliedCoupon.couponCode}</p>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors" title="Remove Coupon">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* 🧾 BILL DETAILS */}
              <h2 className="text-lg font-extrabold text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-4 mb-6">Bill Summary</h2>
              
              <div className="space-y-4 text-sm font-bold text-gray-600 mb-6">
                <div className="flex justify-between items-center">
                  <span>Items Total ({cartItems.length})</span>
                  <span className="text-gray-900 font-black tracking-wide">₹{itemsTotal}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5">Shipping Fee</span>
                  <span className={`font-black tracking-wide ${totalDeliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {totalDeliveryFee === 0 ? 'FREE' : `+ ₹${totalDeliveryFee}`}
                  </span>
                </div>
                
                {/* 🤑 DISCOUNT DISPLAY */}
                {appliedCoupon && (
                  <div className="flex justify-between items-center text-green-600 bg-green-50/50 p-2 rounded-md -mx-2 px-2">
                    <span>Coupon Discount</span>
                    <span className="font-black tracking-wide">- ₹{discountAmount}</span>
                  </div>
                )}
              </div>

              {/* FINAL AMOUNT */}
              <div className="bg-[#fffbf4] p-5 rounded-xl border border-orange-100 mb-8 relative overflow-hidden shadow-inner">
                <div className="flex justify-between items-end relative z-10">
                  <span className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Total Amount</span>
                  <div className="text-right">
                    <span className="text-4xl font-black text-[#c21820] tracking-tighter">₹{finalTotalAmount}</span>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 font-bold text-right mt-1 tracking-widest uppercase">Inclusive of all taxes</p>
              </div>

              {/* CHECKOUT BUTTON */}
              <button 
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-[#8b1818] to-[#6e1313] hover:from-[#a01c1c] hover:to-[#8b1818] text-white font-extrabold text-sm uppercase tracking-widest py-4 md:py-5 px-6 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[0_8px_20px_rgba(139,24,24,0.25)]"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span>100% Safe & Secure Payments</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;