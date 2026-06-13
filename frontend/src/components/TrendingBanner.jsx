import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'; // Added Chevrons
import DefaultTrending from '../assets/2.jpg'; 
import ProductCard from './ProductCard'; 

const TrendingBanner = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerTitle, setBannerTitle] = useState('Elevate Your Spiritual Journey');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 🔥 Slider ke states aur refs
  const scrollContainerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const navigate = useNavigate();
  const API_BASE_URL = 'http://localhost:5000/api'; 

  // 1. Data Fetching Logic
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, settingsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/products`),
          axios.get(`${API_BASE_URL}/public-settings`).catch(() => null) 
        ]);
        
        let productsArray = [];
        if (productsRes.data && productsRes.data.success) {
          productsArray = productsRes.data.data || [];
        } else if (Array.isArray(productsRes.data)) {
          productsArray = productsRes.data;
        }
        
        const trueTrending = productsArray.filter(p => p.isTrending === true);
        
        // Agar jyada products ho, toh 8-10 products tak slider me dikha sakte hain
        if (trueTrending.length > 0) {
          setTrendingProducts(trueTrending.slice(0, 8));
        } else {
          setTrendingProducts(productsArray.slice(0, 8));
        }

        if (settingsRes && settingsRes.data && settingsRes.data.success) {
          const settings = settingsRes.data.data;
          if (settings.trendingTitle) setBannerTitle(settings.trendingTitle);

          let parsedUrls = [];
          if (settings.trendingBannerUrl) {
            try {
              const parsed = JSON.parse(settings.trendingBannerUrl);
              parsedUrls = Array.isArray(parsed) ? parsed : [settings.trendingBannerUrl];
            } catch (e) {
              parsedUrls = settings.trendingBannerUrl.includes(',') 
                ? settings.trendingBannerUrl.split(',') 
                : [settings.trendingBannerUrl];
            }
          }
          
          const cleanUrls = parsedUrls.filter(url => url.trim() !== '');
          setBannerImages(cleanUrls.length > 0 ? cleanUrls : [DefaultTrending]);
        } else {
          setBannerImages([DefaultTrending]);
        }

      } catch (err) {
        console.error("Error fetching trending data:", err);
        setError("Products load nahi ho paaye. Kripya thodi der baad try karein.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 2. Auto-Slide Logic for Banners
  useEffect(() => {
    if (bannerImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % bannerImages.length);
      }, 4000); 
      return () => clearInterval(interval);
    }
  }, [bannerImages.length]);

  // 3. Auto-Slide Logic for PRODUCTS SLIDER (Every 3 seconds)
  useEffect(() => {
    if (isHovered || trendingProducts.length === 0) return;
    
    const intervalId = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        
        if (container.scrollLeft >= maxScrollLeft - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' }); // Wapas start me jao
        } else {
          container.scrollBy({ left: 320, behavior: 'smooth' }); // Ek card aage badho
        }
      }
    }, 3000); // 3 seconds jaisa tumne kaha tha
    
    return () => clearInterval(intervalId);
  }, [isHovered, trendingProducts]);

  // 4. Manual Scroll for Arrows
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; 
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleShopNowClick = () => {
    navigate('/shop?trending=true'); 
  };

  return (
    <div className="py-24 px-4 md:px-12 bg-gradient-to-b from-[#fcfaf5] to-white relative">
      
      <style>
        {`
          @keyframes slideUpFade {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-up {
            animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
          }
          /* Hide scrollbar for slider */
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

      <div className="max-w-7xl mx-auto">
        
        {/* =========================================
            PREMIUM TITLE SECTION 
        ========================================= */}
        <div className="flex flex-col items-center justify-center mb-16 animate-slide-up">
          <p className="text-[#f7941d] font-extrabold uppercase tracking-[0.2em] text-xs mb-3 flex items-center gap-2">
            <Sparkles className="w-3 h-3" /> Season's Special <Sparkles className="w-3 h-3" />
          </p>
          <div className="flex items-center gap-4">
            <div className="hidden md:block w-16 h-[2px] bg-gradient-to-l from-[#8b1818] to-transparent"></div>
            <h2 className="text-3xl md:text-[40px] font-extrabold text-[#8b1818] text-center tracking-wide uppercase flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-[#f7941d] drop-shadow-sm" /> Trending Now
            </h2>
            <div className="hidden md:block w-16 h-[2px] bg-gradient-to-r from-[#8b1818] to-transparent"></div>
          </div>
        </div>

        {/* =========================================
            DYNAMIC SLIDING HERO BANNER 
        ========================================= */}
        <div className="relative w-full h-[300px] md:h-[450px] rounded-sm overflow-hidden mb-20 animate-slide-up group cursor-pointer shadow-[0_20px_50px_rgba(139,24,24,0.15)] ring-1 ring-orange-100">
          {bannerImages.map((imgUrl, idx) => (
            <img 
              key={idx}
              src={imgUrl} 
              alt={`Trending Banner ${idx + 1}`} 
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out transform ${
                idx === currentImageIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none"></div>
          
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20 flex flex-col items-center justify-center text-center">
            <h3 className="text-white text-3xl md:text-5xl font-extrabold mb-8 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] tracking-wide max-w-3xl leading-tight">
              {bannerTitle}
            </h3>
            <button 
              onClick={handleShopNowClick}
              className="bg-gradient-to-r from-[#f7941d] to-[#e0861a] hover:from-[#e0861a] hover:to-[#c26f12] text-white font-extrabold text-sm md:text-base py-3.5 px-10 rounded-sm transition-all duration-300 shadow-[0_5px_15px_rgba(247,148,29,0.4)] hover:shadow-[0_8px_25px_rgba(247,148,29,0.6)] active:scale-95 uppercase tracking-widest flex items-center gap-2"
            >
              Shop Collection <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {bannerImages.length > 1 && (
            <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2 z-20">
              {bannerImages.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`transition-all duration-500 rounded-full ${
                    idx === currentImageIndex ? 'w-8 h-1.5 bg-[#f7941d]' : 'w-1.5 h-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* =========================================
            PRODUCTS SLIDER (🔥 NAYA)
        ========================================= */}
        <div>
          <div className="flex justify-between items-end mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div>
              <h3 className="text-2xl font-extrabold text-gray-800 tracking-wide">Top Picks For You</h3>
              <p className="text-sm text-gray-500 font-medium mt-1">Handpicked spiritual essentials highly loved by devotees.</p>
            </div>
            <button onClick={handleShopNowClick} className="hidden md:flex text-[#8b1818] font-bold hover:text-[#f7941d] transition-colors items-center gap-1 text-sm uppercase tracking-wider">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="flex overflow-x-auto gap-6 md:gap-8 hide-scrollbar">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-sm h-[380px] w-[280px] sm:w-[300px] flex-shrink-0 animate-pulse border border-gray-100 shadow-sm flex flex-col">
                  <div className="w-full h-56 bg-gray-200 rounded-t-sm"></div>
                  <div className="p-5 space-y-4 flex-grow">
                    <div className="h-5 bg-gray-200 rounded-sm w-3/4"></div>
                    <div className="h-4 bg-gray-100 rounded-sm w-1/2"></div>
                    <div className="h-10 bg-gray-200 rounded-sm w-full mt-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center bg-red-50 text-red-600 font-bold p-6 rounded-sm border border-red-100">
              {error}
            </div>
          ) : (
            <div className="relative group/productSlider">
              {/* SLIDER CONTAINER */}
              <div 
                ref={scrollContainerRef}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="flex overflow-x-auto gap-6 md:gap-8 pb-8 pt-4 snap-x snap-mandatory hide-scrollbar items-stretch"
              >
                {trendingProducts.map((product, index) => (
                  <div 
                    key={product.id || product._id}
                    className="animate-slide-up h-full flex-shrink-0 w-[280px] sm:w-[300px] snap-center"
                    style={{ animationDelay: `${(index + 2) * 0.1}s` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* NAVIGATION ARROWS (BELOW THE SLIDER) */}
              {trendingProducts.length > 1 && (
                <div className="flex items-center justify-center mt-2 gap-6 animate-slide-up" style={{ animationDelay: '0.8s' }}>
                  <button 
                    onClick={() => scroll('left')} 
                    className="p-3.5 rounded-full bg-white border border-orange-100 text-[#8b1818] hover:bg-[#8b1818] hover:text-white transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:shadow-md focus:outline-none group"
                  >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={() => scroll('right')} 
                    className="p-3.5 rounded-full bg-white border border-orange-100 text-[#8b1818] hover:bg-[#8b1818] hover:text-white transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:shadow-md focus:outline-none group"
                  >
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile View All Button */}
          <div className="mt-8 text-center md:hidden animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <button onClick={handleShopNowClick} className="w-full border-2 border-[#8b1818] text-[#8b1818] font-extrabold py-3 rounded-sm uppercase tracking-wider text-sm hover:bg-[#8b1818] hover:text-white transition-colors">
              View All Products
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TrendingBanner;