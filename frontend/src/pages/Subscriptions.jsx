import React, { useContext, useState } from 'react';
import { CheckCircle, Sparkles, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Subscriptions = () => {
  const navigate = useNavigate();
  const cartContext = useContext(CartContext);
  const [loadingId, setLoadingId] = useState(null);

  // Subscription plans ka data
  const plans = [
    {
      id: "sub-1",
      name: "Basic Puja Box",
      price: "499",
      duration: "per month",
      description: "Perfect for daily basic rituals and aarti.",
      features: [
        "Premium Agarbatti (2 Packets)",
        "Pure Cow Ghee Diya Batti (30 pcs)",
        "Kumkum & Haldi Pack",
        "Camphor (Kapur) 50g",
        "Standard Delivery (3-5 days)"
      ],
      isPopular: false,
      buttonColor: "bg-transparent border-[2px] border-[#8b1818] text-[#8b1818] hover:bg-[#8b1818] hover:text-white",
      theme: "border-orange-50 bg-white"
    },
    {
      id: "sub-2",
      name: "Premium Family Box",
      price: "999",
      duration: "per month",
      description: "Ideal for joint families and festive occasions.",
      features: [
        "Everything in Basic Box",
        "Sandalwood (Chandan) Stick",
        "Pure Ganga Jal (100ml bottle)",
        "Brass Puja Bell (Ghanti)",
        "Free Priority Delivery (1-2 days)",
        "Special Surprise Gift Every Month"
      ],
      isPopular: true, 
      buttonColor: "bg-[#f7941d] border-[2px] border-[#f7941d] text-white hover:bg-[#e0861a] hover:border-[#e0861a]",
      theme: "border-[#f7941d] bg-[#fffbf4] shadow-[0_15px_35px_rgba(247,148,29,0.15)] transform md:-translate-y-4"
    },
    {
      id: "sub-3",
      name: "Temple Standard",
      price: "1999",
      duration: "per month",
      description: "Bulk samagri for temples or large monthly hawans.",
      features: [
        "Everything in Premium Box",
        "Hawan Samagri (1 kg)",
        "Mango Wood (Aam ki Lakdi)",
        "Premium Dry Fruits Prasad",
        "24/7 Dedicated Support",
        "Cancel or Pause Anytime"
      ],
      isPopular: false,
      buttonColor: "bg-transparent border-[2px] border-[#8b1818] text-[#8b1818] hover:bg-[#8b1818] hover:text-white",
      theme: "border-orange-50 bg-white"
    }
  ];

  // 🎯 Add to Cart Logic for Subscriptions
  const handleSubscribe = (plan) => {
    setLoadingId(plan.id);

    // Context API me properly format karke bhejna taaki cart me sahi se dikhe
    const subscriptionProduct = {
      id: plan.id,
      title: `${plan.name} (Subscription)`,
      price: parseInt(plan.price),
      category: "Subscription",
      imageUrl: "https://placehold.co/300x300/fffbf4/8b1818.jpg&text=Subscription+Box", // Fallback image for cart
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
      // Tooltip manually trigger agar addToCart function nahi hai
      if(cartContext.setShowCartIndicator) cartContext.setShowCartIndicator(true);
    }

    // 1 second loader dikha ke user ko sidha Cart pe bhej do
    setTimeout(() => {
      setLoadingId(null);
      navigate('/cart');
    }, 1000);
  };

  return (
    <div className="bg-[#fcfaf5] min-h-screen py-20 px-6 md:px-12">
      
      <style>
        {`
          @keyframes fadeUpCards {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-up-card {
            animation: fadeUpCards 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto">
        
        {/* =========================================
            HEADER SECTION (Sharp Corporate Decor)
        ========================================= */}
        <div className="flex items-center justify-center mb-16 animate-fade-up-card">
          <div className="hidden md:flex items-center">
            <div className="w-16 lg:w-32 h-[1px] bg-gradient-to-l from-[#8b1818] to-transparent opacity-50"></div>
            <div className="w-2 h-2 bg-[#f7941d] transform rotate-45 mx-4 shadow-sm"></div>
          </div>
          
          <h1 className="text-3xl md:text-[40px] font-extrabold text-[#8b1818] px-4 text-center tracking-wide uppercase">
            Monthly Subscriptions
          </h1>

          <div className="hidden md:flex items-center">
            <div className="w-2 h-2 bg-[#f7941d] transform rotate-45 mx-4 shadow-sm"></div>
            <div className="w-16 lg:w-32 h-[1px] bg-gradient-to-r from-[#8b1818] to-transparent opacity-50"></div>
          </div>
        </div>

        <p className="text-gray-600 max-w-2xl mx-auto text-center font-medium text-lg mb-16 animate-fade-up-card" style={{ animationDelay: "0.1s" }}>
          Never run out of essential pooja samagri. Subscribe once, and receive a fresh, pure, and blessed box at your doorstep every month.
        </p>

        {/* =========================================
            PRICING CARDS GRID (Sharp Edges)
        ========================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto pt-4">
          {plans.map((plan, index) => (
            <div 
              key={plan.id} 
              className={`relative rounded-sm p-8 border-[2px] transition-all duration-500 hover:shadow-[0_15px_35px_rgba(139,24,24,0.08)] flex flex-col group animate-fade-up-card ${plan.theme}`}
              style={{ animationDelay: `${0.2 + index * 0.15}s` }}
            >
              {/* 'Most Popular' Badge - Sharp & Professional */}
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-gradient-to-r from-[#c21820] to-[#8b1818] text-white text-xs font-extrabold px-6 py-2 rounded-sm uppercase tracking-widest flex items-center gap-2 shadow-md">
                    <Star className="w-3.5 h-3.5 fill-current" /> Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8 border-b border-gray-100 pb-8 mt-2">
                <h3 className="text-xl font-extrabold text-gray-800 mb-4 tracking-wide group-hover:text-[#8b1818] transition-colors">{plan.name}</h3>
                <div className="flex items-end justify-center gap-1">
                  <span className="text-4xl font-extrabold text-[#c21820]">₹{plan.price}</span>
                  <span className="text-gray-500 font-bold mb-1">/{plan.duration}</span>
                </div>
                <p className="text-gray-500 text-sm mt-4 font-medium h-10">{plan.description}</p>
              </div>

              {/* Features List */}
              <div className="flex-grow">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className={`w-5 h-5 flex-shrink-0 ${plan.isPopular ? 'text-[#f7941d]' : 'text-[#8b1818]'}`} />
                      <span className="text-gray-600 font-bold text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button (Sharp & Corporate) */}
              <button 
                onClick={() => handleSubscribe(plan)}
                disabled={loadingId === plan.id}
                className={`w-full text-center font-extrabold py-3.5 rounded-sm shadow-sm transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 ${plan.buttonColor} ${loadingId === plan.id ? 'opacity-80 cursor-wait' : ''}`}
              >
                {loadingId === plan.id ? (
                  <><div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div> Processing...</>
                ) : (
                  <>Select {plan.name.split(' ')[0]} Plan <Sparkles className="w-4 h-4" /></>
                )}
              </button>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Subscriptions;