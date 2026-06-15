import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

const Categories = () => {
  const navigate = useNavigate();
  
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'https://arpancart-production.up.railway.app/api';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/categories`);
        if (res.data.success) {
          const activeCategories = res.data.data.filter(cat => cat.isActive !== false);
          setCategoriesData(activeCategories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate(`/shop?category=${encodeURIComponent(categoryName)}`);
  };

  // 🧠 PREMIUM SMART RENDERER
  const renderImageOrEmoji = (imageUrl) => {
    if (!imageUrl) {
      return <div className="w-full h-full bg-[#fff9eb] flex items-center justify-center text-4xl md:text-5xl shadow-inner">🕉️</div>;
    }
    if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) {
      return <img src={imageUrl} alt="category" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />;
    }
    return (
      <div className="w-full h-full bg-[#fff9eb] flex items-center justify-center text-4xl md:text-5xl shadow-inner transition-transform duration-700 group-hover:scale-110">
        {imageUrl}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center bg-[#fcfaf5]">
        <Loader2 className="w-10 h-10 text-[#8b1818] animate-spin mb-4" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Loading Categories...</p>
      </div>
    );
  }

  if (categoriesData.length === 0) return null; 

  return (
    <div className="py-12 md:py-16 px-4 md:px-12 bg-[#fcfaf5] relative">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* =========================================
            PREMIUM SECTION HEADING
        ========================================= */}
        <div className="flex flex-col items-center justify-center mb-10">
          <p className="text-[#f7941d] font-extrabold uppercase tracking-[0.2em] text-xs mb-2">Explore By</p>
          <h2 className="text-3xl md:text-[36px] font-extrabold text-[#8b1818] text-center tracking-wide uppercase flex items-center gap-4">
            <span className="hidden md:block w-12 h-0.5 bg-[#8b1818]/30"></span>
            Divine Categories
            <span className="hidden md:block w-12 h-0.5 bg-[#8b1818]/30"></span>
          </h2>
        </div>

        {/* =========================================
            RESPONSIVE GRID ROWS (NO SLIDER)
        ========================================= */}
        {/* 'flex-wrap' aur 'justify-center' se yeh mobile pe rows mein aur bade screen pe perfect line mein align hoga */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-8 md:gap-x-10 md:gap-y-12">
          {categoriesData.map((category) => (
            <div 
              key={category.id} 
              onClick={() => handleCategoryClick(category.name)} 
              className="group cursor-pointer flex flex-col items-center w-[90px] sm:w-[100px] md:w-[130px]"
            >
              {/* Premium Gradient Ring */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-[110px] md:h-[110px] rounded-full mb-3 p-[3px] bg-gradient-to-tr from-[#8b1818] via-[#f7941d] to-[#ffb86c] opacity-80 group-hover:opacity-100 transition-all duration-500 transform group-hover:-translate-y-2 shadow-sm group-hover:shadow-[0_10px_25px_rgba(247,148,29,0.3)]">
                {/* Inner White Border to create the "Ring" effect */}
                <div className="w-full h-full bg-[#fcfaf5] rounded-full p-1">
                  {/* Actual Image Container */}
                  <div className="w-full h-full rounded-full overflow-hidden relative border border-gray-100 bg-white">
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                    {renderImageOrEmoji(category.imageUrl)}
                  </div>
                </div>
              </div>

              {/* Category Title */}
              <h3 className="font-extrabold text-[12px] md:text-sm text-gray-700 text-center leading-tight group-hover:text-[#c21820] transition-colors line-clamp-2 px-1">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default Categories;