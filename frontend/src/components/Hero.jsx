import React from 'react';
import Heroimg from '../assets/1.png'; 

const Hero = () => {
  return (
    // 1. Main Container (Relative) - Iska color blueprint jaisa light cream rakha hai
    <div className="relative w-full h-[500px] md:h-[600px] bg-[#fff9eb] overflow-hidden">
      
      {/* =========================================
          LEFT SIDE: TEXT & BUTTON (Absolute Position)
      ========================================= */}
      <div className="absolute top-1/2 -translate-y-1/2 left-6 md:left-16 lg:left-32 z-20">
        
        <h1 className="text-[44px] md:text-[56px] lg:text-[72px] font-bold text-[#c21820] leading-[1.1] mb-8">
          Pure & Authentic <br />
          Pooja Samagri
        </h1>

        <button className="bg-[#f7941d] hover:bg-[#e0861a] text-white font-bold text-lg py-3.5 px-10 rounded shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-95">
          Shop Now
        </button>
        
      </div>

      {/* =========================================
          RIGHT SIDE: POOJA IMAGE (Absolute Position)
      ========================================= */}
      {/* Container right se chipka hua hai, bottom se chipka hua hai, aur height 90% hai (thoda chota jaisa tumne kaha) */}
      <div className="absolute bottom-0 right-0 md:right-[-2%] w-[85%] md:w-[65%] lg:w-[60%] h-[90%] z-10 flex justify-end items-end">
        <img 
          src={Heroimg} 
          alt="Pooja Samagri" 
          // object-contain aur object-bottom se image bottom par base banayegi aur fateygi nahi
          className="w-full h-full object-contain object-bottom drop-shadow-2xl mix-blend-multiply" 
        />
      </div>

      {/* Optional: Design element - Right side me halki si glowing light effect (Blueprint feel ke liye) */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/30 to-transparent z-0"></div>

    </div>
  );
};

export default Hero;