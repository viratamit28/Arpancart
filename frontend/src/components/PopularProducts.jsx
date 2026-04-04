import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard'; // Dhyan rakhna ProductCard ka path sahi ho
import { Link } from 'react-router-dom'; 
import { ArrowRight, Sparkles } from 'lucide-react'; 

const PopularProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://arpancart.onrender.com/api/products');
        
        // Solid data extraction logic
        let productsArray = [];
        if (Array.isArray(response.data)) {
          productsArray = response.data;
        } else if (response.data && Array.isArray(response.data.products)) {
          productsArray = response.data.products;
        } else if (response.data && Array.isArray(response.data.data)) {
          productsArray = response.data.data;
        }

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
            TITLE SECTION (Premium & Sharp)
        ========================================= */}
        <div className="flex items-center justify-center mb-16 animate-fade-up">
          <div className="hidden md:flex items-center">
            <div className="w-16 lg:w-32 h-[1px] bg-gradient-to-l from-[#8b1818] to-transparent opacity-50"></div>
            {/* Square diamond indicator instead of round */}
            <div className="w-2 h-2 bg-[#f7941d] transform rotate-45 mx-4 shadow-sm"></div>
          </div>
          
          <h2 className="text-3xl md:text-[36px] font-extrabold text-[#8b1818] px-4 text-center tracking-wide uppercase flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-[#f7941d]" /> Popular Products
          </h2>

          <div className="hidden md:flex items-center">
            <div className="w-2 h-2 bg-[#f7941d] transform rotate-45 mx-4 shadow-sm"></div>
            <div className="w-16 lg:w-32 h-[1px] bg-gradient-to-r from-[#8b1818] to-transparent opacity-50"></div>
          </div>
        </div>

        {/* =========================================
            LOADING SKELETONS (Sharp Design)
        ========================================= */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
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
        )}

        {/* ERROR STATE */}
        {error && (
          <div className="text-center bg-red-50 text-red-600 font-bold p-6 rounded-sm border border-red-100 shadow-sm">
            {error}
          </div>
        )}

        {/* =========================================
            PRODUCTS GRID (MAGIC HAPPENS HERE)
        ========================================= */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {/* 🚨 TRICK: .slice(0, 8) use kiya taaki database me kitne bhi ho sirf 8 hi dikhein */}
              {products.slice(0, 8).map((product, index) => (
                <div 
                  key={product.id || product._id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* =========================================
                VIEW ALL BUTTON (Sharp & Corporate)
            ========================================= */}
            {/* Yeh button tabhi dikhega jab products 8 se zyada honge */}
            {products.length > 8 && (
              <div className="mt-16 flex justify-center animate-fade-up" style={{ animationDelay: '0.8s' }}>
                <Link 
                  to="/shop" 
                  // rounded-sm rakha hai jisse ekdum sharp cut aayega
                  className="inline-flex items-center gap-3 border-[2px] border-[#8b1818] bg-transparent text-[#8b1818] hover:bg-[#8b1818] hover:text-white font-bold text-base md:text-lg py-3.5 px-10 rounded-sm transition-all duration-300 group shadow-sm hover:shadow-[0_8px_20px_rgba(139,24,24,0.2)] active:scale-95"
                >
                  VIEW ALL COLLECTION
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