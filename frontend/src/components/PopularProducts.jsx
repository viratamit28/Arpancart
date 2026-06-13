import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard'; 
import { Link } from 'react-router-dom'; 
import { ArrowRight, Sparkles } from 'lucide-react'; 

const PopularProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Live karne par URL ko .env se lena zaroori hai
  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products`);
        
        // Solid data extraction logic (Maintained exactly as you wrote)
        let productsArray = [];
        if (Array.isArray(response.data)) {
          productsArray = response.data;
        } else if (response.data && Array.isArray(response.data.products)) {
          productsArray = response.data.products;
        } else if (response.data && Array.isArray(response.data.data)) {
          productsArray = response.data.data;
        }

        // Backend se aaye hue products ko set kar diya
        setProducts(productsArray); 
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Products load nahi ho paye. Kripya apna internet connection ya backend check karein.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="py-24 px-4 md:px-12 bg-gradient-to-b from-white to-[#fcfaf5] relative border-t border-orange-50">
      
      <style>
        {`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-up {
            animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto">
        
        {/* =========================================
            PREMIUM TITLE SECTION 
        ========================================= */}
        <div className="flex flex-col items-center justify-center mb-16 animate-fade-up">
          <p className="text-[#f7941d] font-extrabold uppercase tracking-[0.2em] text-xs mb-3 flex items-center gap-2">
            <Sparkles className="w-3 h-3" /> Best Sellers <Sparkles className="w-3 h-3" />
          </p>
          <div className="flex items-center gap-4">
            <div className="hidden md:block w-16 h-[2px] bg-gradient-to-l from-[#8b1818] to-transparent"></div>
            <h2 className="text-3xl md:text-[40px] font-extrabold text-[#8b1818] text-center tracking-wide uppercase">
              Popular Products
            </h2>
            <div className="hidden md:block w-16 h-[2px] bg-gradient-to-r from-[#8b1818] to-transparent"></div>
          </div>
          <p className="text-sm text-gray-500 font-medium mt-4 text-center max-w-lg">
            Humare sabse zyada pasand kiye jaane wale pooja aur spiritual products.
          </p>
        </div>

        {/* =========================================
            LOADING SKELETONS (Sharp Design)
        ========================================= */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white rounded-sm h-[400px] animate-pulse border border-orange-100 shadow-sm flex flex-col">
                <div className="w-full h-56 bg-orange-50 rounded-t-sm border-b border-orange-100"></div>
                <div className="p-5 space-y-4 flex-grow flex flex-col justify-end">
                  <div className="h-5 bg-gray-200 rounded-sm w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded-sm w-1/2"></div>
                  <div className="h-10 bg-gray-200 rounded-sm w-full mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =========================================
            ERROR STATE
        ========================================= */}
        {error && (
          <div className="text-center bg-red-50 text-red-600 font-bold p-6 rounded-sm border border-red-100 shadow-sm mx-auto max-w-2xl">
            {error}
          </div>
        )}

        {/* =========================================
            PRODUCTS GRID (THE MAIN ATTRACTION)
        ========================================= */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {/* 🚨 TRICK: .slice(0, 8) ensures homepage is not cluttered */}
              {products.slice(0, 8).map((product, index) => (
                <div 
                  key={product.id || product._id}
                  className="animate-fade-up h-full"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* If no products are available at all */}
            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 font-bold text-lg">Abhi koi products available nahi hain.</p>
              </div>
            )}

            {/* =========================================
                VIEW ALL BUTTON (Premium & Sharp)
            ========================================= */}
            {/* Show button only if there are more than 8 products */}
            {products.length > 8 && (
              <div className="mt-20 flex justify-center animate-fade-up" style={{ animationDelay: '0.6s' }}>
                <Link 
                  to="/shop" 
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-[#8b1818] to-[#a01c1c] text-white font-extrabold text-sm md:text-base py-4 px-12 rounded-sm transition-all duration-300 group shadow-[0_8px_20px_rgba(139,24,24,0.2)] hover:shadow-[0_12px_25px_rgba(139,24,24,0.4)] active:scale-95 uppercase tracking-widest"
                >
                  View All Collection
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default PopularProducts;