import React from 'react';

import Trending from '../assets/2.jpg'; // 1. Banner image import karo
const TrendingBanner = () => {
  return (
    // Background color ko baaki sections se match karne ke liye cream rakha hai
    <div className="py-12 px-6 md:px-12 bg-[#fcfaf5]">
      <div className="max-w-full mx-auto">
        
        {/* =========================================
            TITLE SECTION (Same Decorative Lines)
        ========================================= */}
        <div className="flex items-center justify-center mb-8">
          {/* Left Decorative Line */}
          <div className="hidden md:flex items-center">
            <div className="w-16 lg:w-32 h-[1px] bg-[#8b1818] opacity-40"></div>
            <div className="w-1.5 h-1.5 bg-[#8b1818] rounded-full mx-2 opacity-60"></div>
          </div>
          
          <h2 className="text-3xl md:text-[32px] font-bold text-[#8b1818] px-4 text-center tracking-wide">
            Trending Products
          </h2>

          {/* Right Decorative Line */}
          <div className="hidden md:flex items-center">
            <div className="w-1.5 h-1.5 bg-[#8b1818] rounded-full mx-2 opacity-60"></div>
            <div className="w-16 lg:w-32 h-[1px] bg-[#8b1818] opacity-40"></div>
          </div>
        </div>

        {/* =========================================
            BANNER & BUTTON SECTION
        ========================================= */}
        {/* Container ko relative banaya taaki button ko iske andar azaadi se move kar sakein */}
        <div className="relative w-full h-[200px] md:h-[300px] lg:h-[350px] rounded-md overflow-hidden shadow-md group cursor-pointer">
          
          {/* 🚨 TEMP IMAGE: Yahan tum blueprint jaisi warm golden light wali wide banner image lagana */}
          <img 
            src={Trending} 
            alt="Trending Pooja Products Banner" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Halka sa bottom shadow (gradient) taaki red button aur zyada ubhar kar aaye */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent"></div>

          {/* Compare Plans Button (Absolute Center Bottom) */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <button className="bg-gradient-to-r from-[#9e1010] to-[#c21820] hover:from-[#7a0c0c] hover:to-[#a31212] text-white font-bold text-base md:text-lg py-3 px-8 md:px-12 rounded shadow-[0_4px_15px_rgba(194,24,32,0.5)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-95 border border-[#e62e36]/30">
              Compare Plans
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default TrendingBanner;