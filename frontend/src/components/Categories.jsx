import React from 'react';
import { useNavigate } from 'react-router-dom'; // 🚨 NEW: Navigation ke liye import

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
  const navigate = useNavigate(); // 🚨 NEW: Navigation hook initialize kiya

  // Function: Click karne par Shop page ke specific section par bhejega
  const handleCategoryClick = (categoryName) => {
    navigate(`/shop#${categoryName}`);
  };

  return (
    <div className="py-16 px-6 md:px-12 bg-[#fcfaf5]">
      <div className="max-w-7xl mx-auto">
        
        {/* TITLE SECTION */}
        <div className="flex items-center justify-center mb-10">
          <div className="hidden md:flex items-center">
            <div className="w-16 lg:w-32 h-[1px] bg-[#8b1818] opacity-40"></div>
            <div className="w-1.5 h-1.5 bg-[#8b1818] rounded-full mx-2 opacity-60"></div>
          </div>
          
          <h2 className="text-3xl md:text-[32px] font-bold text-[#8b1818] px-4 text-center tracking-wide">
            Shop by Category
          </h2>

          <div className="hidden md:flex items-center">
            <div className="w-1.5 h-1.5 bg-[#8b1818] rounded-full mx-2 opacity-60"></div>
            <div className="w-16 lg:w-32 h-[1px] bg-[#8b1818] opacity-40"></div>
          </div>
        </div>

        {/* CATEGORY CARDS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
          {categoriesData.map((category) => (
            <div 
              key={category.id} 
              onClick={() => handleCategoryClick(category.name)} // 🚨 NEW: Click event lagaya
              className="group cursor-pointer rounded-lg overflow-hidden shadow-sm hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-all duration-300 transform hover:-translate-y-1 bg-[#fffbf4] border border-orange-50"
            >
              {/* Image Area */}
              <div className="w-full h-32 md:h-48 overflow-hidden">
                <img 
                  src={category.imageUrl} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Text Banner Area */}
              <div className="py-4 text-center border-t border-orange-100 bg-white">
                <h3 className="font-bold text-gray-800 text-sm md:text-lg tracking-wide group-hover:text-[#c21820] transition-colors">
                  {category.name}
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