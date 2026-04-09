import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// 1. Yahan hum aapka asli logo import kar rahe hain
// Dhyan rahe: Agar path galat bataye, toh '../assets/logo.png' ko apne folder structure ke hisaab se adjust kar lena
import logo from '../assets/logo.png';

const PageLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Jab bhi page (route) change hoga, loader on ho jayega
    setIsLoading(true);

    // 800 milliseconds (0.8s) baad loader apne aap band ho jayega
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [location.pathname]); // Listen to path changes

  if (!isLoading) return null;

  return (
    // 'absolute inset-0' isko sirf main area cover karne dega, Navbar nahi chhipega
    <div className="absolute inset-0 z-50 bg-[#fcfaf5] flex flex-col items-center justify-start pt-32">
      
      <div className="flex flex-col items-center">
        
        {/* =========================================
            ASLI LOGO IMAGE
        ========================================= */}
        <img 
          src={logo} 
          alt="ArpanCart Logo" 
          // w-32 se width set ki hai. Agar logo chhota lage toh w-40 kar lena
          className="w-32 md:w-40 h-auto object-contain mb-4 animate-pulse drop-shadow-md"
        />
        
        {/* Loading text with animated dots */}
        <p className="text-[#8b1818] font-bold tracking-widest text-sm uppercase mt-2">
          Loading
          <span className="animate-bounce inline-block ml-1">.</span>
          <span className="animate-bounce inline-block ml-1" style={{ animationDelay: '0.1s' }}>.</span>
          <span className="animate-bounce inline-block ml-1" style={{ animationDelay: '0.2s' }}>.</span>
        </p>
        
      </div>
      
    </div>
  );
};

export default PageLoader;