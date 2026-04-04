import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import Heroimg from '../assets/2.png'; 

const Hero = () => {
  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }
          .animate-fade-in-up { 
            animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
          }
          .animate-float { 
            animation: float 6s ease-in-out infinite; 
          }
          .delay-200 { animation-delay: 0.2s; }
        `}
      </style>

      <div className="relative w-full h-[500px] md:h-[600px] bg-gradient-to-br from-[#fff9eb] to-[#fcfaf5] overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-[#8b1818] z-30"></div>
        <div className="absolute top-2 left-0 w-full h-0.5 bg-[#f7941d] z-30 opacity-80"></div>

        <div className="absolute top-0 right-0 w-[80%] h-full bg-gradient-to-l from-[#f7941d]/10 to-transparent z-0 blur-3xl"></div>

        <div className="absolute top-1/2 -translate-y-1/2 left-6 md:left-16 lg:left-32 z-20">
          
          <h1 className="text-[44px] md:text-[56px] lg:text-[72px] font-extrabold text-[#c21820] leading-[1.1] mb-8 drop-shadow-sm opacity-0 animate-fade-in-up">
            Pure & Authentic <br />
            <span className="text-[#8b1818]">Pooja Samagri</span>
          </h1>

          <div className="opacity-0 animate-fade-in-up delay-200">
            <Link 
              to="/shop" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#f7941d] to-[#e0861a] hover:from-[#e0861a] hover:to-[#c21820] text-white font-bold text-lg py-4 px-10  shadow-[0_8px_20px_rgba(247,148,29,0.3)] transition-all duration-500 hover:shadow-[0_12px_25px_rgba(247,148,29,0.4)] hover:-translate-y-1 active:scale-95"
            >
              Shop Now
              <Sparkles className="w-5 h-5" />
            </Link>
          </div>
          
        </div>

        <div className="absolute bottom-0 right-0 md:right-[-2%] w-[85%] md:w-[65%] lg:w-[60%] h-[90%] z-10 flex justify-end items-end animate-float">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] bg-[#f7941d] blur-[100px] rounded-full opacity-20"></div>
          
          <img 
            src={Heroimg} 
            alt="Pooja Samagri" 
            className="w-full h-full object-contain object-bottom drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)] mix-blend-multiply relative z-10" 
          />
        </div>

      </div>
    </>
  );
};

export default Hero;