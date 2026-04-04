import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import agarbatti from '../assets/6.jpg';
import diya from '../assets/3.jpg';
import thali from '../assets/4.jpg';
import idol from '../assets/5.jpg';

const categoriesData = [
  { id: 1, name: 'Agarbatti', imageUrl: agarbatti },
  { id: 2, name: 'Diyas', imageUrl: diya },
  { id: 3, name: 'Puja Thali', imageUrl: thali },
  { id: 4, name: 'Idols', imageUrl: idol },
];

const Categories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/shop#${categoryName}`);
  };

  return (
    <div className="py-20 px-6 md:px-12 bg-[#fcfaf5]">
      
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
            TITLE SECTION (Sharp & Corporate)
        ========================================= */}
        <div className="flex items-center justify-center mb-16 animate-fade-up-card">
          <div className="hidden md:flex items-center">
            <div className="w-16 lg:w-32 h-[1px] bg-gradient-to-l from-[#8b1818] to-transparent opacity-50"></div>
            {/* Square Diamond Cut Indicator */}
            <div className="w-2 h-2 bg-[#f7941d] transform rotate-45 mx-4 shadow-sm"></div>
          </div>
          
          <h2 className="text-3xl md:text-[36px] font-extrabold text-[#8b1818] px-4 text-center tracking-wide uppercase">
            Shop by Category
          </h2>

          <div className="hidden md:flex items-center">
            {/* Square Diamond Cut Indicator */}
            <div className="w-2 h-2 bg-[#f7941d] transform rotate-45 mx-4 shadow-sm"></div>
            <div className="w-16 lg:w-32 h-[1px] bg-gradient-to-r from-[#8b1818] to-transparent opacity-50"></div>
          </div>
        </div>

        {/* =========================================
            CATEGORY CARDS (Sharp Edges)
        ========================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {categoriesData.map((category, index) => (
            <div 
              key={category.id} 
              onClick={() => handleCategoryClick(category.name)}
              // 🚨 Yahan rounded-2xl ko rounded-sm kiya gaya hai
              className="group cursor-pointer rounded-sm overflow-hidden bg-white shadow-sm hover:shadow-[0_15px_35px_rgba(139,24,24,0.12)] transition-all duration-500 transform hover:-translate-y-2 border border-orange-50 relative animate-fade-up-card"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              
              <div className="w-full h-40 md:h-56 overflow-hidden relative">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img 
                  src={category.imageUrl} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Text Area styling for Sharp look */}
              <div className="py-5 px-4 text-center border-t-2 border-transparent group-hover:border-[#f7941d] transition-colors duration-500 relative bg-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#fff9eb] to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <h3 className="font-extrabold text-gray-800 text-base md:text-xl tracking-wide group-hover:text-[#c21820] transition-colors relative z-10 flex items-center justify-center">
                  {category.name}
                  <ArrowRight className="w-5 h-5 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 text-[#f7941d]" />
                </h3>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Categories;