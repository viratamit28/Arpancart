import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import DefaultTrending from '../assets/2.jpg'; 
import { CartContext } from '../context/CartContext'; 

const TrendingBanner = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerTitle, setBannerTitle] = useState('Elevate Your Spiritual Journey');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [addingProducts, setAddingProducts] = useState({});
  const { addToCart } = useContext(CartContext);
  
  const scrollContainerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const navigate = useNavigate();
  const API_BASE_URL = 'https://arpancart-production.up.railway.app/api'; 

  // 1. Data Fetching (Exact Admin Panel Logic)
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

  useEffect(() => {
    if (bannerImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % bannerImages.length);
      }, 4000); 
      return () => clearInterval(interval);
    }
  }, [bannerImages.length]);

  useEffect(() => {
    if (isHovered || trendingProducts.length === 0) return;
    
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
  }, [isHovered, trendingProducts]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 640 ? 260 : 320; 
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // 🔥 FIX: Simplified navigation so it cleanly redirects to shop and scrolls to top
  const handleShopNowClick = () => {
    navigate('/shop'); 
    window.scrollTo(0, 0);
  };

  const getProductImage = (product) => {
    if (!product.imageUrl) return "https://placehold.co/400x500/fcfaf5/8b1818?text=Product";
    try {
      if (product.imageUrl.startsWith('[')) {
        return JSON.parse(product.imageUrl)[0];
      }
      return product.imageUrl.split(',')[0];
    } catch (e) {
      return product.imageUrl;
    }
  };

  // ADD TO CART LOGIC
  const handleAddToCart = (e, product) => {
    e.stopPropagation(); 
    const productId = product.id || product._id; 
    
    setAddingProducts(prev => ({ ...prev, [productId]: true }));

    try {
      if (addToCart) {
        // Formatted Item for CartContext
        const cartFormattedItem = {
          id: productId, 
          title: product.title || product.name || "Divine Puja Item", 
          price: product.price || 0,
          originalPrice: product.originalPrice || product.mrp || 0,
          imageUrl: getProductImage(product), 
          deliveryCharge: product.deliveryCharge || 0,
          category: product.category || "General",
          isSubscription: product.isSubscription || false,
          quantity: 1
        };

        addToCart(cartFormattedItem);
      } else {
        console.error("CartContext me addToCart nahi mila!");
      }
    } catch (error) {
      console.error("Cart update error:", error);
    }

    setTimeout(() => {
      setAddingProducts(prev => ({ ...prev, [productId]: false }));
    }, 600);
  };

  return (
    <div className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-gradient-to-b from-[#fcfaf5] to-white relative">
      
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
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

      <div className="max-w-7xl mx-auto">
        
        {/* PREMIUM TITLE SECTION */}
        <div className="flex flex-col items-center justify-center mb-10 md:mb-16 animate-slide-up">
          <p className="text-[#f7941d] font-extrabold uppercase tracking-[0.2em] text-[10px] sm:text-xs mb-3 flex items-center gap-2">
            <Sparkles className="w-3 h-3" /> Season's Special <Sparkles className="w-3 h-3" />
          </p>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden md:block w-12 lg:w-16 h-[2px] bg-gradient-to-l from-[#8b1818] to-transparent"></div>
            <h2 className="text-2xl sm:text-3xl md:text-[40px] font-extrabold text-[#8b1818] text-center tracking-wide uppercase flex items-center gap-2 sm:gap-3">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-[#f7941d] drop-shadow-sm" /> Trending Now
            </h2>
            <div className="hidden md:block w-12 lg:w-16 h-[2px] bg-gradient-to-r from-[#8b1818] to-transparent"></div>
          </div>
        </div>

        {/* DYNAMIC SLIDING HERO BANNER */}
        <div className="relative w-full h-[280px] sm:h-[350px] md:h-[450px] rounded-lg md:rounded-xl overflow-hidden mb-12 sm:mb-16 md:mb-20 animate-slide-up group cursor-pointer shadow-[0_15px_40px_rgba(139,24,24,0.12)] border border-orange-50/50">
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
          
          <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 md:p-12 z-20 flex flex-col items-center justify-center text-center">
            <h3 className="text-white text-2xl sm:text-3xl md:text-5xl font-extrabold mb-5 sm:mb-8 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] tracking-wide max-w-[90%] md:max-w-3xl leading-tight">
              {bannerTitle}
            </h3>
            <button 
              onClick={handleShopNowClick}
              className="bg-gradient-to-r from-[#f7941d] to-[#e0861a] hover:from-[#e0861a] hover:to-[#c26f12] text-white font-extrabold text-[12px] sm:text-sm md:text-base py-3 px-6 sm:px-8 md:px-10 rounded-md transition-all duration-300 shadow-[0_5px_15px_rgba(247,148,29,0.4)] hover:shadow-[0_8px_25px_rgba(247,148,29,0.6)] active:scale-95 uppercase tracking-widest flex items-center gap-2"
            >
              Shop Collection <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {bannerImages.length > 1 && (
            <div className="absolute bottom-3 sm:bottom-4 left-0 w-full flex justify-center gap-1.5 sm:gap-2 z-20">
              {bannerImages.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`transition-all duration-500 rounded-full ${
                    idx === currentImageIndex ? 'w-6 sm:w-8 h-1.5 bg-[#f7941d]' : 'w-1.5 h-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* PRODUCTS SLIDER / GRID HYBRID */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 sm:mb-8 animate-slide-up gap-4" style={{ animationDelay: '0.2s' }}>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-800 tracking-wide">Top Picks For You</h3>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">Handpicked spiritual essentials highly loved by devotees.</p>
            </div>
            <button onClick={handleShopNowClick} className="hidden sm:flex text-[#8b1818] font-bold hover:text-[#f7941d] transition-colors items-center gap-1 text-sm uppercase tracking-wider">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:flex sm:overflow-x-auto sm:gap-6 md:gap-8 hide-scrollbar">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-lg h-[280px] sm:h-[380px] w-full sm:w-[280px] md:w-[320px] flex-shrink-0 animate-pulse border border-gray-100 shadow-sm flex flex-col">
                  <div className="w-full h-36 sm:h-56 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-3 sm:p-5 space-y-3 sm:space-y-4 flex-grow">
                    <div className="h-3 sm:h-5 bg-gray-200 rounded-sm w-3/4"></div>
                    <div className="h-2 sm:h-4 bg-gray-100 rounded-sm w-1/2"></div>
                    <div className="h-8 sm:h-10 bg-gray-200 rounded-md w-full mt-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center bg-red-50 text-red-600 font-bold p-4 sm:p-6 rounded-lg border border-red-100 text-sm sm:text-base">
              {error}
            </div>
          ) : (
            <div className="relative group/productSlider">
              <div 
                ref={scrollContainerRef}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="grid grid-cols-2 gap-3 sm:flex sm:overflow-x-auto sm:gap-6 md:gap-8 pb-4 sm:pb-8 pt-2 sm:snap-x sm:snap-mandatory hide-scrollbar sm:items-stretch"
              >
                {trendingProducts.map((product, index) => {
                  const mrp = product.originalPrice || product.mrp || 0;
                  const price = product.price || 0;
                  const productId = product.id || product._id;
                  const isAdding = addingProducts[productId];
                  
                  const displayTitle = product.title || product.name || "Divine Puja Item";
                  
                  return (
                    <div 
                      key={productId}
                      className="animate-slide-up w-full h-full sm:flex-shrink-0 sm:w-[280px] md:w-[320px] sm:snap-center"
                      style={{ animationDelay: `${(index + 2) * 0.1}s` }}
                    >
                      <div className="flex flex-col bg-white border border-[#f0e6d2] rounded-xl overflow-hidden h-full shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-lg transition-shadow duration-300">
                        
                        {/* 1. Image Section */}
                        <div className="w-full aspect-[4/5] bg-[#fdfbf7] p-2 flex items-center justify-center relative cursor-pointer" onClick={() => navigate(`/product/${productId}`)}>
                          <img 
                            src={getProductImage(product)} 
                            alt={displayTitle} 
                            className="w-full h-full object-contain drop-shadow-sm mix-blend-multiply"
                          />
                          <span className="absolute top-2 left-2 bg-red-100 text-[#8b1818] text-[10px] font-bold px-2 py-0.5 rounded-sm">
                            Top Picks
                          </span>
                        </div>

                        {/* 2. Content Section */}
                        <div className="p-3 sm:p-4 flex flex-col flex-grow items-center text-center">
                          
                          <h3 
                            className="text-[12px] sm:text-sm font-semibold text-gray-800 line-clamp-2 leading-tight mb-2 min-h-[2rem] sm:min-h-[2.5rem] cursor-pointer hover:text-[#8b1818]"
                            onClick={() => navigate(`/product/${productId}`)}
                          >
                            {displayTitle}
                          </h3>

                          {/* 3. Pricing Section */}
                          <div className="mt-auto flex flex-col items-center mb-3">
                            {mrp > price ? (
                              <span className="text-gray-400 line-through text-[11px] sm:text-xs">
                                ₹{mrp.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-transparent text-[11px] sm:text-xs select-none">
                                Placeholder
                              </span>
                            )}
                            <span className="text-[#008a00] font-bold text-[14px] sm:text-[16px]">
                              ₹{price.toFixed(2)}
                            </span>
                          </div>

                          {/* 4. REAL Add to Cart Pill Button */}
                          <button 
                            onClick={(e) => handleAddToCart(e, product)}
                            disabled={isAdding}
                            className={`w-full py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-sm ${
                              isAdding 
                                ? 'bg-green-600 text-white cursor-not-allowed' 
                                : 'bg-[#8b1818] hover:bg-[#6b1212] text-white'
                            }`}
                          >
                            {isAdding ? 'Added ✓' : 'Add to Cart'}
                          </button>

                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Slider Arrows */}
              {trendingProducts.length > 1 && (
                <div className="hidden sm:flex items-center justify-center mt-2 gap-6 animate-slide-up" style={{ animationDelay: '0.8s' }}>
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

          {/* Mobile View All */}
          <div className="mt-6 sm:hidden animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <button onClick={handleShopNowClick} className="w-full border-2 border-[#8b1818] text-[#8b1818] font-extrabold py-3.5 rounded-md uppercase tracking-wider text-[13px] hover:bg-[#8b1818] hover:text-white transition-colors active:scale-[0.98]">
              View All Trending
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TrendingBanner;