import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Sparkles } from 'lucide-react';
import Trending from '../assets/2.jpg';
import ProductCard from './ProductCard'; // 🚨 Naya premium sharp card import kiya

const TrendingBanner = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://arpancart.onrender.com/api/products');
        
        let productsArray = [];
        if (Array.isArray(response.data)) {
          productsArray = response.data;
        } else if (response.data && Array.isArray(response.data.products)) {
          productsArray = response.data.products;
        } else if (response.data && Array.isArray(response.data.data)) {
          productsArray = response.data.data;
        }

        setTrendingProducts(productsArray.slice(0, 4)); 
        setLoading(false);
      } catch (err) {
        console.error("Error fetching trending products:", err);
        setError("Products load nahi ho paaye. Kripya thodi der baad try karein.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleShopNowClick = () => {
    navigate('/shop'); 
  };

  return (
    <div className="py-20 px-6 md:px-12 bg-[#fcfaf5]">
      
      <style>
        {`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-up {
            animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto">
        
        {/* =========================================
            TITLE SECTION (Sharp & Corporate)
        ========================================= */}
        <div className="flex items-center justify-center mb-16 animate-fade-up">
          <div className="hidden md:flex items-center">
            <div className="w-16 lg:w-32 h-[1px] bg-gradient-to-l from-[#8b1818] to-transparent opacity-50"></div>
            {/* Square diamond indicator */}
            <div className="w-2 h-2 bg-[#f7941d] transform rotate-45 mx-4 shadow-sm"></div>
          </div>
          
          <h2 className="text-3xl md:text-[36px] font-extrabold text-[#8b1818] px-4 text-center tracking-wide uppercase flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-[#f7941d]" /> Trending Now
          </h2>

          <div className="hidden md:flex items-center">
            {/* Square diamond indicator */}
            <div className="w-2 h-2 bg-[#f7941d] transform rotate-45 mx-4 shadow-sm"></div>
            <div className="w-16 lg:w-32 h-[1px] bg-gradient-to-r from-[#8b1818] to-transparent opacity-50"></div>
          </div>
        </div>

        {/* =========================================
            HERO BANNER (Sharp edges)
        ========================================= */}
        {/* rounded-2xl hata kar rounded-sm kiya */}
        <div className="relative w-full h-[250px] md:h-[350px] lg:h-[400px] rounded-sm overflow-hidden shadow-sm border border-orange-50 group cursor-pointer mb-16 animate-fade-up">
          <img 
            src={Trending} 
            alt="Trending Pooja Products Banner" 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-full text-center px-4">
            <h3 className="text-white text-2xl md:text-4xl font-extrabold mb-8 drop-shadow-md tracking-wide">
              Elevate Your Spiritual Journey
            </h3>
            <button 
              onClick={handleShopNowClick}
              // Button sharp design me
              className="bg-transparent border-[2px] border-white hover:bg-white hover:text-[#8b1818] text-white font-extrabold text-base md:text-lg py-3.5 px-12 rounded-sm transition-all duration-300 shadow-sm active:scale-95 uppercase tracking-wider flex items-center justify-center gap-2 mx-auto"
            >
              Shop Collection <Sparkles className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =========================================
            PRODUCTS GRID
        ========================================= */}
        <div>
          {loading ? (
            // Skeletons sharp design me
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-sm h-[380px] animate-pulse border border-orange-50 shadow-sm flex flex-col">
                  <div className="w-full h-56 bg-orange-100/50 rounded-t-sm"></div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {trendingProducts.map((product, index) => (
                <div 
                  key={product.id || product._id}
                  className="animate-fade-up h-full"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                 
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default TrendingBanner;