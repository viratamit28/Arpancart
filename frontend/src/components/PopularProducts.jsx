import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom'; // Button click par navigate karne ke liye
import { ArrowRight } from 'lucide-react'; // Ek mast icon button ke liye

const PopularProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data.data); 
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Products load nahi ho paye. Backend check karo.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="py-16 px-6 md:px-12 bg-[#fcfaf5]">
      <div className="max-w-7xl mx-auto">
        
        {/* =========================================
            TITLE SECTION 
        ========================================= */}
        <div className="flex items-center justify-center mb-12">
          <div className="hidden md:flex items-center">
            <div className="w-12 lg:w-24 h-[1px] bg-[#8b1818] opacity-40"></div>
            <div className="w-1.5 h-1.5 bg-[#8b1818] transform rotate-45 mx-1.5 opacity-60"></div>
            <div className="w-1.5 h-1.5 bg-[#8b1818] transform rotate-45 mx-1.5 opacity-60"></div>
          </div>
          
          <h2 className="text-3xl md:text-[34px] font-bold text-[#8b1818] px-6 text-center tracking-wide">
            Popular Products
          </h2>

          <div className="hidden md:flex items-center">
            <div className="w-1.5 h-1.5 bg-[#8b1818] transform rotate-45 mx-1.5 opacity-60"></div>
            <div className="w-1.5 h-1.5 bg-[#8b1818] transform rotate-45 mx-1.5 opacity-60"></div>
            <div className="w-12 lg:w-24 h-[1px] bg-[#8b1818] opacity-40"></div>
          </div>
        </div>

        {loading && <p className="text-[#8b1818] font-medium text-center animate-pulse">Loading Pooja Samagri...</p>}
        {error && <p className="text-red-500 text-center font-bold">{error}</p>}

        {/* =========================================
            PRODUCTS GRID (MAGIC HAPPENS HERE)
        ========================================= */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {/* 🚨 TRICK: .slice(0, 8) use kiya taaki database me 500 ho toh bhi sirf 8 hi dikhein! */}
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* =========================================
                VIEW ALL BUTTON
            ========================================= */}
            {/* Yeh button tabhi dikhega jab products 8 ya usse zyada honge */}
            {products.length > 8 && (
              <div className="mt-12 flex justify-center">
                <Link 
                  to="/shop" 
                  className="flex items-center gap-2 border-2 border-[#8b1818] text-[#8b1818] hover:bg-[#8b1818] hover:text-white font-bold text-lg py-3 px-8 rounded transition-all duration-300 group"
                >
                  View All Products 
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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