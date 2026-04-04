import React from 'react';
import { Leaf, Zap, Truck, Flower2, Sparkles, Clock, ShieldCheck } from 'lucide-react';

const About = () => {
  // Leadership Data
  const leaders = [
    {
      role: "Founders",
      name: "Dr. Shiv Kumar & Adv. Avinash Roshan",
      description: "Founded with a vision to reconnect people with their spiritual roots in the most convenient way. Dr. Shiv Kumar strongly believes that spirituality plays a powerful role in improving mental well-being and creating inner peace."
    },
    {
      role: "CEO",
      name: "Ashish Kumar Jha",
      description: "The heart behind Arpan Cart. He believes in bringing people closer to their roots with trust, care, and honesty. For him, this business is a way to serve people and spread positivity."
    },
    {
      role: "Managing Director",
      name: "Shubham Kumar",
      description: "The strength of Arpan Cart, making sure everything runs smoothly and reaches you with love. He works every day to give you the best experience and sees this business as a responsibility to deliver happiness."
    }
  ];

  // Daily Traditions Data
  const traditions = [
    { day: "Monday", deity: "Lord Shiva", flower: "White Flowers", color: "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300" },
    { day: "Tuesday", deity: "Lord Hanuman", flower: "Red Flowers", color: "bg-red-50/50 border-red-100 text-red-800 hover:border-red-200" },
    { day: "Wednesday", deity: "Lord Ganesha", flower: "Durva & Yellow Flowers", color: "bg-green-50/50 border-green-100 text-green-800 hover:border-green-200" },
    { day: "Thursday", deity: "Lord Vishnu", flower: "Yellow Flowers", color: "bg-yellow-50/50 border-yellow-100 text-yellow-800 hover:border-yellow-200" },
    { day: "Friday", deity: "Goddess Lakshmi", flower: "Lotus & Fragrant Flowers", color: "bg-pink-50/50 border-pink-100 text-pink-800 hover:border-pink-200" },
    { day: "Saturday", deity: "Lord Shani", flower: "Dark/Blue Flowers", color: "bg-blue-50/50 border-blue-100 text-blue-800 hover:border-blue-200" },
    { day: "Sunday", deity: "Lord Surya", flower: "Red Flowers", color: "bg-orange-50/50 border-orange-100 text-orange-800 hover:border-orange-200" }
  ];

  // Services Data
  const services = [
    "Fresh Flowers (Taza & Daily Sourced)",
    "Ready-to-use Puja Kits",
    "Navratri & Diwali Puja Kits",
    "Satyanarayan Katha Puja Kit",
    "Grah Pravesh Puja Samagri",
    "Chhathi / Newborn Ritual Kits",
    "Wedding & Ritual Essentials",
    "Customized Community Kits",
    "Daily Puja Essentials & Samagri"
  ];

  return (
    <div className="bg-[#fcfaf5] min-h-screen py-16 px-6 md:px-12 overflow-hidden">
      
      <style>
        {`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-up {
            animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto">
        
        {/* =========================================
            HEADER SECTION (Sharp Corporate)
        ========================================= */}
        <div className="text-center mb-20 animate-fade-up">
          <div className="flex items-center justify-center mb-6">
            <div className="hidden md:flex items-center">
              <div className="w-16 lg:w-32 h-[1px] bg-gradient-to-l from-[#8b1818] to-transparent opacity-50"></div>
              <div className="w-2 h-2 bg-[#f7941d] transform rotate-45 mx-4 shadow-sm"></div>
            </div>
            
            <h1 className="text-4xl md:text-[42px] font-extrabold text-[#8b1818] px-6 text-center tracking-wide uppercase">
              About Arpan Cart
            </h1>

            <div className="hidden md:flex items-center">
              <div className="w-2 h-2 bg-[#f7941d] transform rotate-45 mx-4 shadow-sm"></div>
              <div className="w-16 lg:w-32 h-[1px] bg-gradient-to-r from-[#8b1818] to-transparent opacity-50"></div>
            </div>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto text-center font-medium text-lg leading-relaxed">
            At Arpan Cart, we believe that spirituality is not just a ritual — it is a way of life that brings peace, balance, and positivity to every home.
          </p>
        </div>

        {/* =========================================
            OUR STORY & MISSION (Sharp Split Layout)
        ========================================= */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 mb-24 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="w-full lg:w-1/2 relative">
            {/* Sharp decorative background */}
            <div className="absolute inset-0 bg-[#f7941d] rounded-sm transform translate-x-4 translate-y-4 opacity-20"></div>
            <img 
              src="https://images.unsplash.com/photo-1590400612999-566b6e4e5b4b?q=80&w=800&auto=format&fit=crop" 
              alt="Pooja Ritual" 
              className="relative w-full h-[450px] object-cover rounded-sm shadow-sm border border-orange-50"
            />
          </div>

          <div className="w-full lg:w-1/2 space-y-6">
            <h2 className="text-3xl font-extrabold text-[#8b1818] mb-4 uppercase tracking-wide">Rooted in Sanatan Dharma</h2>
            <div className="w-12 h-1 bg-[#f7941d] mb-6"></div>
            <p className="text-gray-600 text-lg leading-relaxed">
              In today’s fast-paced world, arranging authentic puja essentials can be time-consuming and expensive. Our mission is to make traditional practices simple, accessible, and meaningful for modern families.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              We solve this by offering <strong className="text-[#8b1818]">authentic, natural, and fresh puja items at fair and honest prices</strong>, so you never have to compromise on quality or overpay during important occasions.
            </p>
            <div className="pt-6 border-t border-orange-100 mt-4">
              <p className="text-[#f7941d] font-extrabold text-xl font-serif italic border-l-4 border-[#f7941d] pl-4">
                "Where devotion meets convenience."
              </p>
            </div>
          </div>
        </div>

        {/* =========================================
            DELIVERY PROMISE BANNER (Sharp Edges)
        ========================================= */}
        <div className="bg-gradient-to-r from-[#8b1818] to-[#6e1313] rounded-sm p-10 md:p-14 text-center text-white shadow-lg mb-24 relative overflow-hidden animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <Zap className="absolute -right-10 -top-10 w-64 h-64 text-white opacity-5 transform rotate-12" />
          
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 tracking-wide">ULTRA-FAST DELIVERY IN PATNA 🚀</h2>
          <p className="text-lg text-white/90 max-w-3xl mx-auto mb-10 font-medium leading-relaxed">
            We proudly offer delivery within minutes in Patna, ensuring that your puja is never delayed — even at the last moment. Whether it’s a planned ritual or a sudden requirement, we are always ready to serve you.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-white/10 backdrop-blur-sm px-8 py-3.5 rounded-sm flex items-center gap-3 border border-white/20 font-bold uppercase tracking-wider text-sm shadow-sm">
              <Clock className="w-5 h-5 text-[#f7941d]" /> 24x7 Availability
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-8 py-3.5 rounded-sm flex items-center gap-3 border border-white/20 font-bold uppercase tracking-wider text-sm shadow-sm">
              <Truck className="w-5 h-5 text-[#f7941d]" /> Delivery in Minutes
            </div>
          </div>
        </div>

        {/* =========================================
            LEADERSHIP TEAM (Sharp Cards)
        ========================================= */}
        <div className="mb-24">
          <div className="text-center mb-16 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-3xl font-extrabold text-[#8b1818] mb-4 uppercase tracking-wide">The Hearts Behind Arpan Cart</h2>
            <p className="text-gray-500 font-medium">Dedicated to bringing people closer to their roots with trust and care.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leaders.map((leader, index) => (
              <div 
                key={index} 
                className="bg-white p-8 md:p-10 rounded-sm shadow-sm border border-orange-50 hover:shadow-[0_15px_35px_rgba(139,24,24,0.08)] transition-all duration-500 transform hover:-translate-y-2 relative group animate-fade-up"
                style={{ animationDelay: `${0.4 + index * 0.15}s` }}
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#f7941d] group-hover:bg-[#8b1818] transition-colors duration-500"></div>
                
                <span className="bg-orange-50 text-[#f7941d] text-[10px] font-extrabold px-3 py-1.5 rounded-sm uppercase tracking-widest mb-6 inline-block border border-orange-100">
                  {leader.role}
                </span>
                <h3 className="text-xl font-extrabold text-gray-800 mb-4 group-hover:text-[#8b1818] transition-colors">{leader.name}</h3>
                <p className="text-gray-600 leading-relaxed text-sm font-medium">
                  {leader.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================
            TRADITIONS WE HONOR (Sharp Grid)
        ========================================= */}
        <div className="mb-24">
          <div className="text-center mb-16 animate-fade-up" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-3xl font-extrabold text-[#8b1818] mb-4 flex items-center justify-center gap-3 uppercase tracking-wide">
              <Flower2 className="w-8 h-8 text-[#f7941d]" /> Traditions We Honor
            </h2>
            <p className="text-gray-500 font-medium max-w-2xl mx-auto">
              We preserve the rich traditions of Sanatan Dharma, where each day holds spiritual importance. By making them easy to follow, we keep our cultural heritage alive.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {traditions.map((item, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-sm border ${item.color} flex flex-col items-center text-center shadow-sm hover:shadow-[0_10px_20px_rgba(0,0,0,0.05)] transition-all duration-300 transform hover:-translate-y-1 animate-fade-up`}
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <h4 className="font-extrabold text-lg mb-1 uppercase tracking-wide">{item.day}</h4>
                <p className="font-bold text-sm mb-4 opacity-80">{item.deity}</p>
                <span className="bg-white/80 px-4 py-2 rounded-sm text-xs font-extrabold w-full truncate border border-black/5 uppercase tracking-wider shadow-sm">
                  {item.flower}
                </span>
              </div>
            ))}
            
            {/* Filler card for 4-column symmetry */}
            <div className="p-6 rounded-sm border border-orange-100 bg-orange-50 flex flex-col items-center justify-center text-center shadow-sm animate-fade-up" style={{ animationDelay: '1.2s' }}>
              <ShieldCheck className="w-10 h-10 text-[#f7941d] mb-3" />
              <p className="font-extrabold text-[#8b1818] text-sm uppercase tracking-widest">Pure Devotion<br/>Every Day</p>
            </div>
          </div>
        </div>

        {/* =========================================
            WHAT WE OFFER (Sharp Badges)
        ========================================= */}
        <div className="bg-white rounded-sm p-10 md:p-16 shadow-sm border border-orange-50 text-center relative overflow-hidden animate-fade-up" style={{ animationDelay: '0.6s' }}>
          <Leaf className="absolute -right-10 -bottom-10 w-64 h-64 text-orange-50 opacity-40 transform -rotate-45" />
          
          <h2 className="text-3xl font-extrabold text-[#8b1818] mb-10 relative z-10 uppercase tracking-wide">What We Offer</h2>
          
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            {services.map((service, index) => (
              <span 
                key={index} 
                className="bg-[#fcfaf5] text-gray-800 font-extrabold text-sm px-6 py-3.5 rounded-sm border-[2px] border-orange-50 hover:border-[#f7941d] hover:text-[#8b1818] hover:bg-white transition-all duration-300 shadow-sm cursor-default"
              >
                {service}
              </span>
            ))}
          </div>
          
          <p className="text-gray-600 mt-12 font-medium text-lg relative z-10 max-w-3xl mx-auto border-t border-gray-100 pt-10 leading-relaxed">
            At Arpan Cart, we are more than just a service — we are your trusted partner in devotion. Simplifying rituals, supporting local artisans, and bringing spirituality closer to your everyday life.
          </p>
        </div>

      </div>
    </div>
  );
};

export default About;