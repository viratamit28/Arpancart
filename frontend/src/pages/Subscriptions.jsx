import React from 'react';
import { CheckCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Subscriptions = () => {
  // Subscription plans ka data
  const plans = [
    {
      id: 1,
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
      buttonColor: "bg-[#8b1818] hover:bg-[#6e1313]",
      theme: "border-orange-100 bg-white"
    },
    {
      id: 2,
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
      isPopular: true, // Ise highlight karenge
      buttonColor: "bg-gradient-to-r from-[#f7941d] to-[#e0861a] hover:shadow-lg",
      theme: "border-[#f7941d] bg-[#fffbf4] shadow-[0_8px_30px_rgba(247,148,29,0.15)] transform md:-translate-y-4"
    },
    {
      id: 3,
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
      buttonColor: "bg-[#8b1818] hover:bg-[#6e1313]",
      theme: "border-orange-100 bg-white"
    }
  ];

  return (
    <div className="bg-[#fcfaf5] min-h-screen py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* =========================================
            HEADER SECTION (Premium Decor)
        ========================================= */}
        <div className="text-center mb-16 mt-4">
          <div className="flex items-center justify-center mb-6">
            <div className="hidden md:flex items-center">
              <div className="w-12 lg:w-24 h-[1px] bg-[#8b1818] opacity-40"></div>
              <div className="w-1.5 h-1.5 bg-[#8b1818] transform rotate-45 mx-1.5 opacity-60"></div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#8b1818] px-6 text-center tracking-wide uppercase">
              Monthly Subscriptions
            </h1>

            <div className="hidden md:flex items-center">
              <div className="w-1.5 h-1.5 bg-[#8b1818] transform rotate-45 mx-1.5 opacity-60"></div>
              <div className="w-12 lg:w-24 h-[1px] bg-[#8b1818] opacity-40"></div>
            </div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-center font-medium text-lg">
            Never run out of essential pooja samagri. Subscribe once, and receive a fresh, pure, and blessed box at your doorstep every month.
          </p>
        </div>

        {/* =========================================
            PRICING CARDS GRID
        ========================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto pt-4">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`relative rounded-2xl p-8 border-2 transition-all duration-300 flex flex-col ${plan.theme}`}
            >
              {/* 'Most Popular' Badge for Middle Card */}
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-[#8b1818] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3 h-3" /> Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8 border-b border-gray-100 pb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{plan.name}</h3>
                <div className="flex items-end justify-center gap-1">
                  <span className="text-4xl font-extrabold text-[#c21820]">₹{plan.price}</span>
                  <span className="text-gray-500 font-medium mb-1">/{plan.duration}</span>
                </div>
                <p className="text-gray-500 text-sm mt-4 font-medium">{plan.description}</p>
              </div>

              {/* Features List */}
              <div className="flex-grow">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className={`w-5 h-5 flex-shrink-0 ${plan.isPopular ? 'text-[#f7941d]' : 'text-[#8b1818]'}`} />
                      <span className="text-gray-600 font-medium text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <Link 
                to="/checkout" // Real app me yeh subscription checkout flow pe jayega
                className={`w-full text-center text-white font-bold py-3.5 rounded-lg shadow-md transition-transform active:scale-95 ${plan.buttonColor}`}
              >
                Choose {plan.name.split(' ')[0]}
              </Link>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Subscriptions;