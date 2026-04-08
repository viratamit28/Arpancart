import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

// Images import. Dhyan rakhein exact spelling match honi chahiye
import img1 from '../assets/a.png';
import img2 from '../assets/b.png';
import img3 from '../assets/c.png';
import img4 from '../assets/d.png';
import img5 from '../assets/e.png';
import img6 from '../assets/f.png';
import img7 from '../assets/g.png';

const categoriesData = [
  { id: 1, name: 'Navratri Puja Kit', imageUrl: img1 },
  { id: 2, name: 'Vaha Puja Kit', imageUrl: img2 },
  { id: 3, name: 'Saraswati Puja Kit', imageUrl: img3 },
  { id: 4, name: 'Satyanarayan Puja Kit', imageUrl: img4 },
  { id: 5, name: 'Rudraabhishek Puja Kit', imageUrl: img5 },
  { id: 6, name: 'Hanuman Ji Puja Kit', imageUrl: img6 },
  { id: 7, name: 'Shanidev Puja Kit', imageUrl: img7 },
];

const Categories = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;

    const intervalId = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        
        if (container.scrollLeft >= maxScrollLeft - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: 320, behavior: 'smooth' });
        }
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [isHovered]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollPosition = scrollContainerRef.current.scrollLeft;
      const newIndex = Math.round(scrollPosition / 320); 
      setActiveIndex(newIndex);
    }
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/shop#${categoryName}`);
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; 
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="py-20 px-6 md:px-12 bg-gradient-to-b from-[#fcfaf5] to-white relative overflow-hidden">
      
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="flex items-center justify-center mb-12">
          <div className="hidden md:flex items-center">
            <div className="w-16 lg:w-32 h-[1px] bg-gradient-to-l from-[#8b1818] to-transparent opacity-50"></div>
            <div className="w-2 h-2 bg-[#f7941d] transform rotate-45 mx-4 shadow-sm"></div>
          </div>
          
          <h2 className="text-3xl md:text-[36px] font-extrabold text-[#8b1818] px-4 text-center tracking-wide uppercase">
            Shop by Category
          </h2>

          <div className="hidden md:flex items-center">
            <div className="w-2 h-2 bg-[#f7941d] transform rotate-45 mx-4 shadow-sm"></div>
            <div className="w-16 lg:w-32 h-[1px] bg-gradient-to-r from-[#8b1818] to-transparent opacity-50"></div>
          </div>
        </div>

        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex overflow-x-auto gap-6 md:gap-8 pb-4 pt-4 snap-x snap-mandatory hide-scrollbar"
        >
          {categoriesData.map((category) => (
            <div 
              key={category.id} 
              onClick={() => handleCategoryClick(category.name)}
              className="group cursor-pointer rounded-md overflow-hidden bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_35px_rgba(139,24,24,0.12)] transition-all duration-500 transform hover:-translate-y-2 border-b-4 border-transparent hover:border-[#f7941d] relative flex-shrink-0 w-[280px] md:w-[300px] snap-center"
            >
              <div className="w-full h-56 md:h-64 overflow-hidden relative">
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img 
                  src={category.imageUrl} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <div className="py-5 px-4 text-center relative bg-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#fff9eb] to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <h3 className="font-extrabold text-gray-800 text-lg tracking-wide group-hover:text-[#c21820] transition-colors relative z-10 flex items-center justify-center">
                  {category.name}
                  <ArrowRight className="w-5 h-5 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 text-[#f7941d]" />
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center mt-10 gap-6">
          <button 
            onClick={() => scroll('left')}
            className="p-3 rounded-full bg-white border border-gray-200 text-[#8b1818] hover:bg-[#8b1818] hover:text-white hover:border-[#8b1818] transition-all duration-300 shadow-sm focus:outline-none"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            {categoriesData.map((_, index) => (
              <div 
                key={index}
                className={`transition-all duration-500 rounded-full ${
                  activeIndex === index 
                    ? 'w-8 h-2 bg-[#f7941d]' 
                    : 'w-2 h-2 bg-gray-300'
                }`}
              ></div>
            ))}
          </div>

          <button 
            onClick={() => scroll('right')}
            className="p-3 rounded-full bg-white border border-gray-200 text-[#8b1818] hover:bg-[#8b1818] hover:text-white hover:border-[#8b1818] transition-all duration-300 shadow-sm focus:outline-none"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Categories;