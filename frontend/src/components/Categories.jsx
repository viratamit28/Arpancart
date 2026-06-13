import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import axios from 'axios';

const Categories = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

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

  // Auto-scroll logic 
  useEffect(() => {
    if (isHovered || categoriesData.length === 0) return;
    
    const intervalId = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        
        if (container.scrollLeft >= maxScrollLeft - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: 200, behavior: 'smooth' });
        }
      }
    }, 3500); 
    
    return () => clearInterval(intervalId);
  }, [isHovered, categoriesData]);

  const handleCategoryClick = (categoryName) => {
    navigate(`/shop?category=${encodeURIComponent(categoryName)}`);
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; 
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
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
    <div className="py-16 px-4 md:px-12 bg-[#fcfaf5] relative overflow-hidden">
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
      
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
            CIRCULAR CATEGORY CAROUSEL
        ========================================= */}
        <div className="relative group/slider">
          
          {/* Left Scroll Button (Absolute positioned) */}
          <button 
            onClick={() => scroll('left')} 
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 md:-ml-6 z-20 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)] text-[#8b1818] hover:bg-[#8b1818] hover:text-white transition-all duration-300 opacity-0 group-hover/slider:opacity-100 disabled:opacity-0"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div 
            ref={scrollContainerRef} 
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)} 
            className="flex overflow-x-auto gap-4 md:gap-8 pb-8 pt-4 px-4 snap-x snap-mandatory hide-scrollbar items-start"
          >
            {categoriesData.map((category) => (
              <div 
                key={category.id} 
                onClick={() => handleCategoryClick(category.name)} 
                className="group cursor-pointer flex flex-col items-center flex-shrink-0 w-[100px] md:w-[130px] snap-center"
              >
                {/* Premium Gradient Ring */}
                <div className="relative w-24 h-24 md:w-[110px] md:h-[110px] rounded-full mb-3 p-[3px] bg-gradient-to-tr from-[#8b1818] via-[#f7941d] to-[#ffb86c] opacity-80 group-hover:opacity-100 transition-all duration-500 transform group-hover:-translate-y-2 shadow-sm group-hover:shadow-[0_10px_25px_rgba(247,148,29,0.3)]">
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
                <h3 className="font-extrabold text-[13px] md:text-sm text-gray-700 text-center leading-tight group-hover:text-[#c21820] transition-colors line-clamp-2 px-1">
                  {category.name}
                </h3>
              </div>
            ))}
          </div>

          {/* Right Scroll Button (Absolute positioned) */}
          <button 
            onClick={() => scroll('right')} 
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 md:-mr-6 z-20 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)] text-[#8b1818] hover:bg-[#8b1818] hover:text-white transition-all duration-300 opacity-0 group-hover/slider:opacity-100"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default Categories;