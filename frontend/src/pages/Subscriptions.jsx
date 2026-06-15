import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, ArrowRight, MapPin, Sparkles, CheckCircle2, MessageCircle } from 'lucide-react';

const Subscriptions = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // WhatsApp number fallback
  const [whatsappNumber, setWhatsappNumber] = useState('910000000000');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    landmark: '',
    pincode: '',
    packageId: '',
    days: []
  });

  const API_BASE_URL = 'https://arpancart-production.up.railway.app/api';

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const [plansRes, settingsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/subscriptions/plans`),
          axios.get(`${API_BASE_URL}/public-settings`).catch(() => null)
        ]);

        if (plansRes.data && plansRes.data.success) {
          setPlans(plansRes.data.data.filter(plan => plan.isActive !== false));
        } else if (Array.isArray(plansRes.data)) {
          setPlans(plansRes.data);
        }

        if (settingsRes && settingsRes.data && settingsRes.data.success) {
           setWhatsappNumber(settingsRes.data.data.whatsappNumber || '910000000000');
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Could not load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDayChange = (day) => {
    setFormData(prev => {
      const days = [...prev.days];
      if (day === 'Every Day') {
        return { ...prev, days: ['Every Day'] };
      }
      const filteredDays = days.filter(d => d !== 'Every Day');
      if (filteredDays.includes(day)) {
        return { ...prev, days: filteredDays.filter(d => d !== day) };
      } else {
        return { ...prev, days: [...filteredDays, day] };
      }
    });
  };

  // 🔥 SENIOR DEV LOGIC: Card Click & Smooth Scroll
  const handlePackageSelect = (planId) => {
    setFormData(prev => ({ ...prev, packageId: planId }));
    
    // Smoothly scroll down to the form
    const formElement = document.getElementById('subscription-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address || !formData.packageId || formData.days.length === 0) {
      alert("Please fill all required fields and select at least one day.");
      return;
    }
    
    console.log("Subscription Order Placed:", formData);
    alert("Thank you! Your subscription request has been received. Our team will contact you shortly.");
  };

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="bg-[#fcfaf5] min-h-screen font-sans text-gray-800 pb-20">
      
      {/* =========================================
          HERO SECTION
      ========================================= */}
      <div className="bg-[#8b1818] text-white py-12 md:py-16 px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 font-normal tracking-tight">Daily Fresh Puja Flowers</h1>
        <p className="text-white/80 max-w-2xl mx-auto text-sm md:text-base font-medium">
          Select your preferred package below, fill in your details, and get fresh flowers delivered silently to your doorstep every morning.
        </p>
      </div>

      {/* =========================================
          SECTION 1: PRICING CARDS (Moved to TOP)
      ========================================= */}
      <div className="py-12 bg-[#fcfaf5]">
        <div className="max-w-5xl mx-auto px-4">
          
          {/* Location Bar */}
          <div className="w-full max-w-4xl mx-auto bg-[#facbaf] hover:bg-[#f3bc9d] cursor-default transition-colors rounded-full py-3 px-6 flex justify-center md:justify-between items-center mb-12 shadow-sm">
            <div className="flex items-center gap-3 text-gray-900 font-bold">
              <MapPin className="w-5 h-5 text-[#8b1818]" />
              Locations we serve flowers in Patna
            </div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-black mb-3  tracking-tight">Choose Your Package</h2>
            <div className="w-20 h-1 bg-[#f7941d] mx-auto rounded-full"></div>
            <p className="text-gray-500 mt-3 font-medium text-sm">Click on a package to select it and proceed to details</p>
          </div>

          {loading ? (
             <div className="text-center py-10 font-bold text-[#8b1818]">Loading plans...</div>
          ) : error ? (
             <div className="text-center py-10 text-red-500 font-bold">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 max-w-5xl mx-auto items-stretch">
              
              {/* Box 1: Basic (Green) */}
              {plans[0] && (
                <div 
                  onClick={() => handlePackageSelect(plans[0].id)}
                  className={`flex flex-col border-2 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 relative ${
                    formData.packageId === plans[0].id 
                      ? 'border-[#14532d] ring-4 ring-[#14532d]/20 scale-[1.02] shadow-2xl' 
                      : 'border-green-500 hover:shadow-xl hover:-translate-y-1'
                  }`}
                >
                  {/* Selection Badge */}
                  {formData.packageId === plans[0].id && (
                    <div className="absolute top-3 right-3 bg-[#14532d] text-white rounded-full p-1 z-20">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  )}

                  <div className="p-6 text-center border-b-2 border-green-500 bg-[#e6ffe6]">
                    <h3 className="text-2xl font-bold text-[#14532d] mb-4">₹{Math.round(plans[0].price / plans[0].durationDays)}/day</h3>
                    <div className="h-px w-full bg-green-500/30 mb-4"></div>
                    <h4 className="text-xl font-serif font-bold text-[#14532d] leading-tight px-2">{plans[0].name}</h4>
                  </div>
                  <div className="p-6 bg-[#dcfce7] flex-grow">
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2 text-sm text-[#14532d] font-semibold"><Check className="w-4 h-4 stroke-[3] text-green-600"/> Marigold 6 pcs</li>
                      <li className="flex items-center gap-2 text-sm text-[#14532d] font-semibold"><Check className="w-4 h-4 stroke-[3] text-green-600"/> Assorted Flowers</li>
                      <li className="flex items-center gap-2 text-sm text-[#14532d] font-semibold"><Check className="w-4 h-4 stroke-[3] text-green-600"/> Durba</li>
                      <li className="flex items-center gap-2 text-sm text-[#14532d] font-semibold"><Check className="w-4 h-4 stroke-[3] text-green-600"/> Tulsi</li>
                    </ul>
                  </div>
                  {/* Select Button */}
                  <div className={`py-4 text-center font-bold text-sm uppercase tracking-wider transition-colors ${formData.packageId === plans[0].id ? 'bg-[#14532d] text-white' : 'bg-green-500 text-white'}`}>
                    {formData.packageId === plans[0].id ? 'Selected' : 'Select Plan'}
                  </div>
                </div>
              )}

              {/* Box 2: Premium (Yellow/Orange) - Recommended */}
              {plans[1] && (
                <div 
                  onClick={() => handlePackageSelect(plans[1].id)}
                  className={`flex flex-col border-2 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 relative ${
                    formData.packageId === plans[1].id 
                      ? 'border-[#c21820] ring-4 ring-[#c21820]/20 scale-[1.03] shadow-2xl z-10' 
                      : 'border-[#f59e0b] hover:shadow-xl hover:-translate-y-1'
                  }`}
                >
                  <div className="absolute top-0 w-full bg-[#c21820] text-white text-center py-1.5 text-xs font-bold tracking-widest uppercase z-10">
                    Recommended
                  </div>
                  
                  {/* Selection Badge */}
                  {formData.packageId === plans[1].id && (
                    <div className="absolute top-10 right-3 bg-[#c21820] text-white rounded-full p-1 z-20">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  )}

                  <div className="p-6 pt-12 text-center border-b-2 border-[#f59e0b] bg-[#fef3c7]">
                    <h3 className="text-2xl font-bold text-[#78350f] mb-4">₹{Math.round(plans[1].price / plans[1].durationDays)}/day</h3>
                    <div className="h-px w-full bg-[#f59e0b]/30 mb-4"></div>
                    <h4 className="text-xl font-serif font-bold text-[#78350f] leading-tight px-2">{plans[1].name}</h4>
                  </div>
                  <div className="p-6 bg-[#fde68a] flex-grow">
                     <ul className="space-y-3">
                      <li className="flex items-center gap-2 text-sm text-[#78350f] font-semibold"><Check className="w-4 h-4 stroke-[3] text-[#b45309]"/> Marigold 6 pcs</li>
                      <li className="flex items-center gap-2 text-sm text-[#78350f] font-semibold"><Check className="w-4 h-4 stroke-[3] text-[#b45309]"/> Assorted Flowers</li>
                      <li className="flex items-center gap-2 text-sm text-[#78350f] font-semibold"><Check className="w-4 h-4 stroke-[3] text-[#b45309]"/> Durba</li>
                      <li className="flex items-center gap-2 text-sm text-[#78350f] font-semibold"><Check className="w-4 h-4 stroke-[3] text-[#b45309]"/> Tulsi</li>
                      <li className="flex items-center gap-2 text-sm text-[#78350f] font-semibold"><Check className="w-4 h-4 stroke-[3] text-[#b45309]"/> Bel Patta</li>
                      <li className="flex items-center gap-2 text-sm text-[#78350f] font-semibold"><Check className="w-4 h-4 stroke-[3] text-[#b45309]"/> Genda Mala 1 pc</li>
                    </ul>
                  </div>
                  {/* Select Button */}
                  <div className={`py-4 text-center font-bold text-sm uppercase tracking-wider transition-colors ${formData.packageId === plans[1].id ? 'bg-[#c21820] text-white' : 'bg-[#f59e0b] text-[#78350f]'}`}>
                    {formData.packageId === plans[1].id ? 'Selected' : 'Select Plan'}
                  </div>
                </div>
              )}

              {/* Box 3: Customized (Dark Red) */}
              <div className="flex flex-col border border-[#7f1d1d] rounded-xl overflow-hidden bg-[#7f1d1d] shadow-lg relative hover:shadow-xl transition-all duration-300">
                <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                  <Sparkles className="w-8 h-8 text-[#f7941d] mb-4 opacity-80" />
                  <h3 className="text-2xl font-serif font-bold text-white mb-2 leading-snug">Customized your<br/>monthly pack</h3>
                  <p className="text-lg font-bold text-[#facbaf] mb-10">as you need</p>
                  <a 
                    href={`https://wa.me/${whatsappNumber}?text=Hare%20Krishna!%20Mujhe%20Patna%20me%20customized%20flower%20package%20banwana%20hai.`}
                    target="_blank" rel="noopener noreferrer"
                    className="bg-white hover:bg-gray-100 text-[#7f1d1d] font-bold py-3 px-6 rounded-full text-sm transition-colors w-[90%] shadow-md flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" /> Customize Now
                  </a>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* =========================================
          SECTION 2: THE INQUIRY/ORDER FORM
          (UPDATED WITH REQUESTED FONT/TYPOGRAPHY STYLE)
      ========================================= */}
      <div id="subscription-form" className="max-w-4xl mx-auto px-4 py-16 scroll-mt-20">
        <div className="bg-white rounded-xl p-8 md:p-10 shadow-sm border border-gray-100">
          
          <div className="mb-10 text-left">
            <h2 className="text-[24px] md:text-[28px] text-[#333333] font-normal tracking-tight">
              Get Fresh Puja Flowers daily at your doorstep
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Personal Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-12 md:gap-y-8">
              <div className="space-y-1.5">
                <label className="text-[14px] font-bold text-[#666666] block">Full Name <span className="text-red-500">*</span></label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full border border-[#d1d5db] rounded-lg px-4 py-3 focus:outline-none focus:border-gray-400 bg-[#fbfbfb] text-gray-800 transition-colors" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-[14px] font-bold text-[#666666] block">Phone <span className="text-red-500">*</span></label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border border-[#d1d5db] rounded-lg px-4 py-3 focus:outline-none focus:border-gray-400 bg-[#fbfbfb] text-gray-800 transition-colors" required />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[14px] font-bold text-[#666666] block">Full Address <span className="text-red-500">*</span></label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full border border-[#d1d5db] rounded-lg px-4 py-3 focus:outline-none focus:border-gray-400 bg-[#fbfbfb] text-gray-800 transition-colors" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-[14px] font-bold text-[#666666] block">Landmark <span className="text-red-500">*</span></label>
                <input type="text" name="landmark" value={formData.landmark} onChange={handleInputChange} className="w-full border border-[#d1d5db] rounded-lg px-4 py-3 focus:outline-none focus:border-gray-400 bg-[#fbfbfb] text-gray-800 transition-colors" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-[14px] font-bold text-[#666666] block">Pincode <span className="text-red-500">*</span></label>
                <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full border border-[#d1d5db] rounded-lg px-4 py-3 focus:outline-none focus:border-gray-400 bg-[#fbfbfb] text-gray-800 transition-colors" required />
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100">
              <h2 className="text-[20px] md:text-[22px] text-[#333333] font-normal tracking-tight mb-8">
                Select the Package & days you want Puja Flowers
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Package Auto-sync */}
                <div className="space-y-1.5">
                  <label className="text-[14px] font-bold text-[#666666] block">Flower Package <span className="text-red-500">*</span></label>
                  <select 
                    name="packageId" 
                    value={formData.packageId} 
                    onChange={handleInputChange} 
                    className="w-full border border-[#d1d5db] rounded-lg px-4 py-3 focus:outline-none focus:border-gray-400 bg-[#fbfbfb] text-gray-800 transition-colors appearance-none"
                    required
                  >
                    <option value="" disabled>Select Package</option>
                    {plans.map(plan => (
                      <option key={plan.id} value={plan.id}>{plan.name} - ₹{plan.price}/{plan.durationDays} days</option>
                    ))}
                  </select>
                </div>

                {/* Days Selector */}
                <div className="space-y-3">
                  <label className="text-[14px] font-bold text-[#666666] block mb-3">Days <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 gap-y-3">
                    <label className="flex items-center gap-3 cursor-pointer col-span-2 mb-1">
                      <input 
                        type="checkbox" 
                        checked={formData.days.includes('Every Day')} 
                        onChange={() => handleDayChange('Every Day')} 
                        className="w-4 h-4 text-[#8b1818] rounded focus:ring-[#8b1818] border-gray-300 cursor-pointer"
                      />
                      <span className="text-[#333333] text-[15px]">Every Day</span>
                    </label>

                    {weekDays.map(day => (
                      <label key={day} className="flex items-center gap-3 cursor-pointer">
                         <input 
                          type="checkbox" 
                          checked={formData.days.includes(day)} 
                          onChange={() => handleDayChange(day)} 
                          className="w-4 h-4 text-orange-500 rounded focus:ring-[#f7941d] border-gray-300 cursor-pointer"
                        />
                        <span className="text-[#333333] text-[15px]">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-8">
              <button 
                type="submit" 
                className={`w-full md:w-auto px-10 py-3.5 rounded-md font-bold tracking-wide transition-all text-[15px] ${
                  formData.packageId 
                    ? 'bg-[#8b1818] text-white hover:bg-[#6b1212] shadow-sm' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* =========================================
          SECTION 3: PANDIT JI BANNER
      ========================================= */}
      <div className="max-w-6xl mx-auto px-4 mb-10">
        <div className="relative bg-gradient-to-br from-[#8b1818] via-[#751111] to-[#4a0808] rounded-3xl overflow-hidden shadow-2xl p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Decorative Elements */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#f7941d] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#ffb86c] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

          {/* Content */}
          <div className="relative z-10 text-center md:text-left flex-1">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight text-white mb-4 ">
              Got a list from your Pandit Ji?
            </h2>
            <p className="text-white/80 text-lg md:text-xl font-medium max-w-xl">
              Don't stress. Send us the list directly on WhatsApp, and we'll arrange everything you need for the perfect puja.
            </p>
          </div>

          {/* Button */}
          <div className="relative z-10 flex-shrink-0">
            <a 
              href={`https://wa.me/${whatsappNumber}?text=Pranam!%20Ye%20rahi%20meri%20Pandit%20Ji%20ki%20list:%20`}
              target="_blank" rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-white text-[#8b1818] px-8 py-4 rounded-full font-bold text-lg shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:scale-105 transition-all duration-300"
            >
              <MessageCircle className="w-6 h-6 text-[#25D366]" />
              Send List Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Subscriptions;