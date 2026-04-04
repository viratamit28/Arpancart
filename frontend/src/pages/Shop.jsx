import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import TrendingBanner from '../components/TrendingBanner';
import { SlidersHorizontal, Search, X, ChevronRight, Sparkles } from 'lucide-react';


const Shop = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  
  // Loading & Error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL Query ke liye (Navbar se search karne par yahan aayega)
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  // 1. Fetch Products
  useEffect(() => {
    window.scrollTo(0, 0); 
    
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get('https://arpancart.onrender.com/api/products');
        
        let productsArray = [];
        if (Array.isArray(response.data)) productsArray = response.data;
        else if (response.data?.products) productsArray = response.data.products;
        else if (response.data?.data) productsArray = response.data.data;

        setAllProducts(productsArray); 
        
        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(productsArray.map(p => p.category).filter(Boolean))];
        setCategories(uniqueCategories);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching shop products:", err);
        setError("Products load nahi ho paye. Please check your connection.");
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // 2. Hash scroll check (Agar Homepage se direct category click ki hai)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && categories.length > 0) {
      const categoryFromHash = decodeURIComponent(hash.substring(1));
      if (categories.includes(categoryFromHash)) {
        setSelectedCategory(categoryFromHash);
      }
    }
  }, [categories]);

  // 3. Apply Filters & Sorting dynamically
  useEffect(() => {
    let result = [...allProducts];

    // Apply Search Query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(p => 
        (p.title && p.title.toLowerCase().includes(lowerQuery)) || 
        (p.category && p.category.toLowerCase().includes(lowerQuery))
      );
    }

    // Apply Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Apply Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
    }

    setFilteredProducts(result);
  }, [allProducts, searchQuery, selectedCategory, sortBy]);


  return (
    <div className="py-12 px-4 md:px-8 lg:px-12 bg-[#fcfaf5] min-h-screen">
      
      <style>
        {`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-up {
            animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}
      </style>

      <div className="max-w-[1400px] mx-auto">
        
        {/* =========================================
            HEADER & SEARCH INDICATOR
        ========================================= */}
        <div className="mb-10 animate-fade-up">
          <div className="flex items-center gap-3 text-[#8b1818] mb-2">
            <Sparkles className="w-6 h-6 text-[#f7941d]" />
            <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-wide">
              Pooja Samagri Collection
            </h1>
          </div>
          <p className="text-gray-600 font-medium">Explore pure and authentic items for your spiritual rituals.</p>
          
          {/* Agar search active hai toh banner dikhao */}
          {searchQuery && (
            <div className="mt-4 inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-[#8b1818] px-4 py-2 rounded-sm font-bold shadow-sm">
              <Search className="w-4 h-4" />
              Showing results for: "{searchQuery}"
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* =========================================
              LEFT SIDEBAR (FILTERS)
          ========================================= */}
          <div className="w-full lg:w-1/4 flex flex-col gap-6 sticky top-24 z-10 animate-fade-up">
            
            <div className="bg-white p-6 rounded-sm shadow-sm border border-orange-50">
              <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <SlidersHorizontal className="w-5 h-5 text-[#f7941d]" />
                <h2 className="text-xl font-extrabold text-gray-800 uppercase tracking-wide">Filters</h2>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-bold text-[#8b1818] mb-4 uppercase text-sm tracking-wider">Categories</h3>
                <div className="flex flex-col gap-2">
                  {categories.map((cat, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex items-center justify-between text-left px-3 py-2.5 rounded-sm font-medium transition-all duration-300 border-l-[3px] ${
                        selectedCategory === cat 
                          ? 'bg-orange-50 border-[#f7941d] text-[#8b1818] font-bold' 
                          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-[#8b1818]'
                      }`}
                    >
                      {cat}
                      {selectedCategory === cat && <ChevronRight className="w-4 h-4 text-[#f7941d]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Support Box in Sidebar */}
            <div className="bg-gradient-to-br from-[#8b1818] to-[#6e1313] p-6 rounded-sm shadow-md text-white">
              <h3 className="font-extrabold text-lg mb-2">Need Help?</h3>
              <p className="text-sm text-white/80 mb-4">Can't find what you are looking for? Contact our support.</p>
              <a href="tel:+919123187724" className="inline-block bg-white text-[#8b1818] font-bold py-2 px-4 rounded-sm text-sm hover:bg-[#f7941d] hover:text-white transition-colors">
                Call +91 91231 87724
              </a>
            </div>

          </div>

          {/* =========================================
              RIGHT SIDE (PRODUCTS GRID & SORT)
          ========================================= */}
          <div className="w-full lg:w-3/4 animate-fade-up">
            
            {/* Top Toolbar (Item Count & Sort) */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-sm shadow-sm border border-orange-50 mb-6 gap-4">
              <div className="font-bold text-gray-600">
                Showing <span className="text-[#8b1818]">{filteredProducts.length}</span> products
              </div>
              
              <div className="flex items-center gap-3">
                <label className="font-bold text-gray-600 text-sm uppercase">Sort By:</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#fcfaf5] border border-gray-200 text-gray-800 font-bold text-sm rounded-sm focus:ring-[#f7941d] focus:border-[#f7941d] block p-2.5 outline-none cursor-pointer"
                >
                  <option value="default">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* LOADING STATE */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-sm h-[380px] animate-pulse border border-orange-50 shadow-sm">
                    <div className="w-full h-56 bg-orange-100/50"></div>
                    <div className="p-5 space-y-4">
                      <div className="h-5 bg-gray-200 w-3/4"></div>
                      <div className="h-4 bg-gray-100 w-1/2"></div>
                      <div className="h-10 bg-gray-200 mt-6"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ERROR STATE */}
            {error && (
              <div className="bg-red-50 text-red-600 font-bold p-6 rounded-sm border border-red-100 text-center">
                {error}
              </div>
            )}

            {/* EMPTY RESULTS STATE */}
            {!loading && !error && filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-sm shadow-sm border border-orange-50 text-center">
                <X className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-800 text-2xl font-extrabold mb-2">No items found</p>
                <p className="text-gray-500 font-medium">
                  {searchQuery ? `We couldn't find anything matching "${searchQuery}".` : "Try changing your category filters."}
                </p>
                <button 
                  onClick={() => { setSelectedCategory('All'); window.location.href = '/shop'; }}
                  className="mt-6 border-[2px] border-[#8b1818] text-[#8b1818] hover:bg-[#8b1818] hover:text-white font-bold py-2 px-6 rounded-sm transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* PRODUCT GRID */}
            {!loading && !error && filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </div>
            )}

          </div>
        </div>

<TrendingBanner />
      </div>
    </div>
  );
};

export default Shop;