import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0); 
    
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data.data); 
        setLoading(false);
      } catch (err) {
        console.error("Error fetching shop products:", err);
        setError("Products load nahi ho paye. Please try again.");
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // Hash Scrolling Logic
  useEffect(() => {
    if (!loading && products.length > 0) {
      const hash = window.location.hash; 
      if (hash) {
        const elementId = decodeURIComponent(hash.substring(1)); 
        const element = document.getElementById(elementId);
        
        if (element) {
          setTimeout(() => {
            const yOffset = -100; 
            const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }, 100);
        }
      }
    }
  }, [loading, products]);

  // Group Products by Category
  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category || 'Other Samagri';
    
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    
    return acc;
  }, {});

  return (
    <div className="py-12 px-6 md:px-12 bg-[#fcfaf5] min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* PAGE MAIN HEADER */}
        <div className="mb-16 mt-4 text-center">
          <h1 className="text-4xl md:text-[42px] font-extrabold text-[#8b1818] tracking-wide uppercase mb-4">
            Shop By Category
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto font-medium text-lg">
            Explore our curated collections of pure and authentic pooja essentials.
          </p>
        </div>

        {/* LOADING & ERROR STATES */}
        {loading && (
          <div className="flex justify-center items-center h-40">
            <p className="text-[#8b1818] font-bold animate-pulse text-xl tracking-wider">Loading Collections...</p>
          </div>
        )}
        {error && (
          <div className="flex justify-center items-center h-40">
            <p className="text-red-500 font-bold text-xl">{error}</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-orange-50">
            <span className="text-6xl mb-4">🪔</span>
            <p className="text-gray-800 text-2xl font-bold">No products available yet.</p>
          </div>
        )}

        {/* CATEGORY WISE SECTIONS */}
        {!loading && !error && Object.keys(groupedProducts).length > 0 && (
          <div className="space-y-20"> 
            
            {Object.entries(groupedProducts).map(([categoryName, categoryProducts], index) => (
              <div key={index} id={categoryName} className="category-section scroll-mt-24">
                {/* 🚨 Comment ko div ke andar move kar diya error fix karne ke liye */}
                
                {/* SECTION HEADER */}
                <div className="flex items-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-[#8b1818] uppercase tracking-wide">
                    {categoryName}
                  </h2>
                  <div className="flex items-center ml-6 flex-grow opacity-60">
                    <div className="w-2 h-2 bg-[#f7941d] rounded-full transform rotate-45"></div>
                    <div className="w-full h-[1px] bg-gradient-to-r from-[#8b1818] to-transparent ml-2"></div>
                  </div>
                </div>

                {/* SECTION PRODUCTS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                  {categoryProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default Shop;