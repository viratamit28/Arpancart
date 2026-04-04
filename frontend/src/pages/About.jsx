import React from 'react';
import { Leaf, ShieldCheck, Heart, Clock, Zap, Truck, Flower2, Sparkles } from 'lucide-react';

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
    { day: "Monday", deity: "Lord Shiva", flower: "White Flowers", color: "bg-gray-100 border-gray-200 text-gray-700" },
    { day: "Tuesday", deity: "Lord Hanuman", flower: "Red Flowers", color: "bg-red-50 border-red-200 text-red-700" },
    { day: "Wednesday", deity: "Lord Ganesha", flower: "Durva & Yellow Flowers", color: "bg-green-50 border-green-200 text-green-700" },
    { day: "Thursday", deity: "Lord Vishnu", flower: "Yellow Flowers", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
    { day: "Friday", deity: "Goddess Lakshmi & Durga", flower: "Lotus & Fragrant Flowers", color: "bg-pink-50 border-pink-200 text-pink-700" },
    { day: "Saturday", deity: "Lord Shani", flower: "Dark/Blue Flowers", color: "bg-blue-50 border-blue-200 text-blue-700" },
    { day: "Sunday", deity: "Lord Surya", flower: "Red Flowers", color: "bg-orange-50 border-orange-200 text-orange-700" }
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
    "Customized Community Kits (Bihari, Bengali, Marwari)",
    "Daily Puja Essentials & Samagri"
  ];

  return (
    <div className="bg-[#fcfaf5] min-h-screen py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* =========================================
            HEADER SECTION 
        ========================================= */}
        <div className="text-center mb-16 mt-4">
          <div className="flex items-center justify-center mb-6">
            <div className="hidden md:flex items-center">
              <div className="w-12 lg:w-24 h-[1px] bg-[#8b1818] opacity-40"></div>
              <div className="w-1.5 h-1.5 bg-[#8b1818] transform rotate-45 mx-1.5 opacity-60"></div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#8b1818] px-6 text-center tracking-wide uppercase">
              About Arpan Cart
            </h1>

            <div className="hidden md:flex items-center">
              <div className="w-1.5 h-1.5 bg-[#8b1818] transform rotate-45 mx-1.5 opacity-60"></div>
              <div className="w-12 lg:w-24 h-[1px] bg-[#8b1818] opacity-40"></div>
            </div>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto text-center font-medium text-lg leading-relaxed">
            At Arpan Cart, we believe that spirituality is not just a ritual — it is a way of life that brings peace, balance, and positivity to every home.
          </p>
        </div>

        {/* =========================================
            OUR STORY & MISSION (Split Layout)
        ========================================= */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 mb-24">
          <div className="w-full lg:w-1/2 relative">
            {/* Theme Matched Image Decoration */}
            <div className="absolute inset-0 bg-[#f7941d] rounded-2xl transform translate-x-4 translate-y-4 opacity-20"></div>
            <img 
              src="https://images.unsplash.com/photo-1590400612999-566b6e4e5b4b?q=80&w=800&auto=format&fit=crop" 
              alt="Pooja Ritual" 
              className="relative w-full h-[400px] object-cover rounded-2xl shadow-lg border-2 border-white"
            />
          </div>

          <div className="w-full lg:w-1/2 space-y-6">
            <h2 className="text-3xl font-extrabold text-[#8b1818] mb-4">Rooted in Sanatan Dharma</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              In today’s fast-paced world, arranging authentic puja essentials can be time-consuming and expensive. Our mission is to make traditional practices simple, accessible, and meaningful for modern families.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              We solve this by offering <strong className="text-[#8b1818]">authentic, natural, and fresh puja items at fair and honest prices</strong>, so you never have to compromise on quality or overpay during important occasions.
            </p>
            <div className="pt-4 border-t border-orange-100">
              <p className="text-[#f7941d] font-extrabold text-xl font-serif italic">
                "Where devotion meets convenience."
              </p>
            </div>
          </div>
        </div>

        {/* =========================================
            DELIVERY PROMISE BANNER (Highlight USP)
        ========================================= */}
        <div className="bg-gradient-to-r from-[#8b1818] to-[#a31c1c] rounded-2xl p-8 md:p-12 text-center text-white shadow-xl mb-24 relative overflow-hidden">
          {/* Decorative Background Icon */}
          <Zap className="absolute -right-10 -top-10 w-48 h-48 text-white opacity-5 transform rotate-12" />
          
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Ultra-Fast Delivery in Patna 🚀</h2>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-8 font-medium">
            We proudly offer delivery within minutes in Patna, ensuring that your puja is never delayed — even at the last moment. Whether it’s a planned ritual or a sudden requirement, we are always ready to serve you.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full flex items-center gap-2 border border-white/20 font-bold">
              <Clock className="w-5 h-5 text-[#f7941d]" /> 24x7 Availability
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full flex items-center gap-2 border border-white/20 font-bold">
              <Truck className="w-5 h-5 text-[#f7941d]" /> Delivery in Minutes
            </div>
          </div>
        </div>

        {/* =========================================
            LEADERSHIP & TEAM (Grid)
        ========================================= */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#8b1818] mb-4">The Hearts Behind Arpan Cart</h2>
            <p className="text-gray-500 font-medium">Dedicated to bringing people closer to their roots with trust and care.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leaders.map((leader, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-orange-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative group">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#f7941d] to-[#8b1818] opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl"></div>
                <span className="bg-orange-50 text-[#f7941d] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block border border-orange-100">
                  {leader.role}
                </span>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{leader.name}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {leader.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================
            TRADITIONS WE HONOR (7 Days Grid)
        ========================================= */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#8b1818] mb-4 flex items-center justify-center gap-3">
              <Flower2 className="w-8 h-8 text-[#f7941d]" /> Traditions We Honor
            </h2>
            <p className="text-gray-500 font-medium max-w-2xl mx-auto">
              We preserve the rich traditions of Sanatan Dharma, where each day holds spiritual importance. By making them easy to follow, we keep our cultural heritage alive.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {traditions.map((item, index) => (
              <div key={index} className={`p-5 rounded-xl border ${item.color} flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow`}>
                <h4 className="font-bold text-lg mb-1">{item.day}</h4>
                <p className="font-medium text-sm mb-3 opacity-80">{item.deity}</p>
                <span className="bg-white/60 px-3 py-1 rounded-full text-xs font-bold w-full truncate border border-black/5">
                  {item.flower}
                </span>
              </div>
            ))}
            {/* 8th filler card for perfect 4-column grid */}
            <div className="p-5 rounded-xl border border-orange-100 bg-orange-50/50 flex flex-col items-center justify-center text-center shadow-sm">
              <Sparkles className="w-8 h-8 text-[#f7941d] mb-2" />
              <p className="font-bold text-[#8b1818] text-sm">Pure Devotion<br/>Every Day</p>
            </div>
          </div>
        </div>

        {/* =========================================
            WHAT WE OFFER (Services Badges)
        ========================================= */}
        <div className="bg-white rounded-3xl p-10 md:p-14 shadow-sm border border-orange-100 text-center relative overflow-hidden">
          <Leaf className="absolute -left-10 -bottom-10 w-40 h-40 text-orange-50 opacity-50" />
          
          <h2 className="text-3xl font-extrabold text-[#8b1818] mb-8 relative z-10">What We Offer</h2>
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            {services.map((service, index) => (
              <span key={index} className="bg-[#fcfaf5] text-gray-700 font-bold px-5 py-3 rounded-lg border border-orange-100 hover:border-[#f7941d] hover:text-[#c21820] transition-colors shadow-sm cursor-default">
                {service}
              </span>
            ))}
          </div>
          
          <p className="text-gray-600 mt-10 font-medium text-lg relative z-10 max-w-2xl mx-auto border-t border-gray-100 pt-8">
            At Arpan Cart, we are more than just a service — we are your trusted partner in devotion. Simplifying rituals, supporting local artisans, and bringing spirituality closer to your everyday life.
          </p>
        </div>

      </div>
    </div>
  );
};

export default About;