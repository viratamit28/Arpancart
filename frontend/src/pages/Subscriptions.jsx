import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { CheckCircle2, Leaf, Clock, ShieldCheck, Sparkles, CalendarDays, Loader2, Star } from 'lucide-react';

const Subscriptions = () => {
  const navigate = useNavigate();
  const cartContext = useContext(CartContext);
  
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  // Start Date Logic (Default to tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultStartDate = tomorrow.toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(defaultStartDate);

  const API_BASE_URL = 'http://localhost:5000/api';

  // 1. Fetch Plans from Backend (Updated URL as per new route)
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPlans = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/subscriptions/plans`);
        if (res.data && res.data.success) {
          setPlans(res.data.data.filter(plan => plan.isActive !== false));
        } else if (Array.isArray(res.data)) {
          setPlans(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch subscription plans:", err);
        setError("Plans load nahi ho paaye. Kripya thodi der baad try karein.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // 2. Add to Cart Logic
  const handleSubscribe = (plan) => {
    if (!startDate) {
      alert("Please select a start date for your flower delivery.");
      return;
    }

    setLoadingId(plan.id);

    const subscriptionProduct = {
      id: `sub-${plan.id}`, 
      title: `${plan.name} (Starts: ${startDate})`,
      price: parseInt(plan.price),
      category: "Subscription",
      isSubscription: true,
      startDate: startDate,       
      durationDays: plan.durationDays, 
      imageUrl: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=800&auto=format&fit=crop", 
    };

    if (cartContext.addToCart) {
      cartContext.addToCart(subscriptionProduct);
    } else if (cartContext.setCartItems) {
      cartContext.setCartItems(prev => {
        const existingItem = prev.find(item => item.id === subscriptionProduct.id);
        if (existingItem) {
          return prev.map(item => item.id === subscriptionProduct.id ? { ...item, quantity: item.quantity + 1 } : item);
        }
        return [...prev, { ...subscriptionProduct, quantity: 1 }];
      });
      if(cartContext.setShowCartIndicator) cartContext.setShowCartIndicator(true);
    }

    setTimeout(() => {
      setLoadingId(null);
      navigate('/cart');
    }, 1000);
  };

  return (
    <div className="bg-[#fcfaf5] min-h-screen pb-20">
      
      <style>
        {`
          @keyframes slideUpCards {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-up-card {
            animation: slideUpCards 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
          }
        `}
      </style>

      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r from-[#8b1818] to-[#5a0f0f] py-20 px-4 md:px-8 shadow-md text-center">
        <div className="max-w-3xl mx-auto animate-fade-up-card">
          <div className="inline-flex items-center justify-center bg-white/10 p-4 rounded-full backdrop-blur-md mb-6 shadow-inner border border-white/20">
            <Sparkles className="w-8 h-8 text-[#f7941d] drop-shadow-md" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white uppercase tracking-widest drop-shadow-lg mb-4">
            Daily Fresh Flowers
          </h1>
          <p className="text-sm md:text-lg text-white/90 font-medium leading-relaxed max-w-2xl mx-auto">
            Subscribe once and get farm-fresh, pure flowers delivered silently to your doorstep every morning before 7 AM for your daily puja.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 -mt-8 relative z-10">
        
        {/* Features Trust Bar */}
        <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-orange-50 p-6 md:p-10 mb-16 animate-fade-up-card" style={{ animationDelay: '0.1s' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center">
              <Leaf className="w-8 h-8 text-[#f7941d] mb-3" />
              <h3 className="font-extrabold text-gray-800 text-sm md:text-base">100% Fresh</h3>
            </div>
            <div className="flex flex-col items-center text-center">
              <Clock className="w-8 h-8 text-[#f7941d] mb-3" />
              <h3 className="font-extrabold text-gray-800 text-sm md:text-base">Morning Delivery</h3>
            </div>
            <div className="flex flex-col items-center text-center">
              <CalendarDays className="w-8 h-8 text-[#f7941d] mb-3" />
              <h3 className="font-extrabold text-gray-800 text-sm md:text-base">Pause Anytime</h3>
            </div>
            <div className="flex flex-col items-center text-center">
              <ShieldCheck className="w-8 h-8 text-[#f7941d] mb-3" />
              <h3 className="font-extrabold text-gray-800 text-sm md:text-base">Zero Delivery Fee</h3>
            </div>
          </div>
        </div>

        {/* Step 1: Start Date */}
        <div className="max-w-2xl mx-auto mb-16 animate-fade-up-card" style={{ animationDelay: "0.2s" }}>
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-orange-100 shadow-[0_8px_30px_rgba(247,148,29,0.08)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#f7941d]"></div>
            <h3 className="text-[#8b1818] font-extrabold text-xl mb-2 flex items-center gap-2">
              <span className="bg-[#8b1818] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span> 
              Select Start Date
            </h3>
            <p className="text-sm text-gray-500 mb-6 font-medium ml-8">Choose when you want your subscription to start.</p>
            
            <div className="ml-8 relative">
              <CalendarDays className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#f7941d] w-5 h-5 pointer-events-none" />
              <input 
                type="date" 
                min={defaultStartDate}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#fcfaf5] border border-orange-200 py-4 pl-12 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f7941d] font-bold text-gray-700 transition-colors cursor-pointer shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Choose Plan */}
        <div className="text-center mb-10 animate-fade-up-card" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-[#8b1818] font-extrabold text-2xl flex items-center justify-center gap-2">
            <span className="bg-[#8b1818] text-white w-7 h-7 rounded-full flex items-center justify-center text-base">2</span> 
            Choose Your Plan
          </h3>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="w-12 h-12 text-[#8b1818] animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center bg-red-50 text-red-600 font-bold p-6 rounded-xl border border-red-100 max-w-2xl mx-auto">
            {error}
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 font-bold text-lg">Currently, no subscription plans are active. Please check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => {
              const isPopular = plan.durationDays === 30 || index === 1;

              return (
                <div 
                  key={plan.id} 
                  className={`relative flex flex-col bg-white rounded-2xl transition-all duration-500 animate-fade-up-card ${
                    isPopular 
                      ? 'border-2 border-[#f7941d] shadow-[0_15px_40px_rgba(247,148,29,0.15)] transform md:-translate-y-4 z-10' 
                      : 'border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-lg mt-4'
                  }`}
                  style={{ animationDelay: `${(index + 4) * 0.15}s` }}
                >
                  {isPopular && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#c21820] to-[#8b1818] text-white px-6 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-md z-20 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" /> Most Popular
                    </div>
                  )}

                  <div className={`p-8 pb-6 rounded-t-2xl text-center ${isPopular ? 'bg-orange-50/40' : ''}`}>
                    <h3 className="text-2xl font-extrabold text-gray-800 uppercase tracking-wide mb-2">{plan.name}</h3>
                    <p className="text-xs font-extrabold text-[#f7941d] bg-orange-100 inline-block px-3 py-1 rounded-sm mb-6 uppercase tracking-wider">
                      {plan.durationDays} Days Plan
                    </p>
                    
                    <div className="flex justify-center items-end gap-1">
                      <span className="text-4xl font-black text-[#8b1818]">₹{plan.price}</span>
                      <span className="text-gray-500 font-bold mb-1">/ total</span>
                    </div>
                    <p className="text-xs font-bold text-gray-400 mt-2">
                      (Approx ₹{Math.round(plan.price / plan.durationDays)} per day)
                    </p>
                  </div>

                  <div className="w-full h-[1px] bg-gray-100"></div>

                  <div className="p-8 flex-grow flex flex-col">
                    <ul className="space-y-4 mb-8 flex-grow">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isPopular ? 'text-[#f7941d]' : 'text-green-500'}`} />
                        <span className="text-gray-600 font-medium text-sm">Fresh assorted puja flowers</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isPopular ? 'text-[#f7941d]' : 'text-green-500'}`} />
                        <span className="text-gray-600 font-medium text-sm">Free morning delivery</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isPopular ? 'text-[#f7941d]' : 'text-green-500'}`} />
                        <span className="text-gray-600 font-medium text-sm">Cancel or pause anytime</span>
                      </li>
                    </ul>

                    <button 
                      onClick={() => handleSubscribe(plan)}
                      disabled={loadingId === plan.id}
                      className={`w-full py-4 rounded-xl font-extrabold text-sm uppercase tracking-widest transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 ${
                        isPopular 
                          ? 'bg-gradient-to-r from-[#f7941d] to-[#e0861a] text-white shadow-[0_8px_20px_rgba(247,148,29,0.3)] hover:shadow-[0_12px_25px_rgba(247,148,29,0.4)]' 
                          : 'bg-transparent text-[#8b1818] border-[2px] border-[#8b1818] hover:bg-[#8b1818] hover:text-white'
                      } ${loadingId === plan.id ? 'opacity-80 cursor-wait' : ''}`}
                    >
                      {loadingId === plan.id ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                      ) : (
                        <>Subscribe Now <Sparkles className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscriptions;