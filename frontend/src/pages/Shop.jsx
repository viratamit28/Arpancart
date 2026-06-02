import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
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

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  const urlCategory = searchParams.get('category'); 

  // 1. Fetch Products
  useEffect(() => {
    window.scrollTo(0, 0); 
    
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get('https://arpancart-production.up.railway.app/api/products');
        
        let productsArray = [];
        if (Array.isArray(response.data)) productsArray = response.data;
        else if (response.data?.products) productsArray = response.data.products;
        else if (response.data?.data) productsArray = response.data.data;

        setAllProducts(productsArray); 
        
        const uniqueCategories = ['All', ...new Set(productsArray.map(p => p.category ? p.category.trim() : '').filter(Boolean))];
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

  // 2. Sync URL with Category
  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    } else {
      setSelectedCategory('All');
    }
  }, [urlCategory]);

  // 3. Apply Filters & Sort
  useEffect(() => {
    let result = [...allProducts];

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(p => 
        (p.title && p.title.toLowerCase().includes(lowerQuery)) || 
        (p.category && p.category.toLowerCase().includes(lowerQuery))
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter(p => {
        if (!p.category) return false;
        const dbCategory = p.category.toLowerCase().trim();
        const targetCategory = selectedCategory.toLowerCase().trim();
        return dbCategory.includes(targetCategory) || targetCategory.includes(dbCategory);
      });
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
    }

    setFilteredProducts(result);
  }, [allProducts, searchQuery, selectedCategory, sortBy]);

  // 4. Handle Click
  const handleSidebarCategoryClick = (cat) => {
    if (cat === 'All') {
      navigate('/shop');
    } else {
      navigate(`/shop?category=${encodeURIComponent(cat)}`);
    }
  };

  return (
    <div className="py-8 md:py-12 px-4 md:px-8 lg:px-12 bg-[#fcfaf5] min-h-screen">
      
      <style>
        {`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-up {
            animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          /* Custom scrollbar for categories to keep UI premium */
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #fffbf4; 
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #f7941d; 
            border-radius: 4px;
          }
        `}
      </style>

      <div className="max-w-[1400px] mx-auto">
        
        {/* HEADER SECTION */}
        <div className="mb-8 md:mb-10 animate-fade-up">
          <div className="flex flex-wrap items-center gap-3 text-[#8b1818] mb-2">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-[#f7941d]" />
            <h1 className="text-2xl md:text-4xl font-extrabold uppercase tracking-wide">
              Pooja Samagri Collection
            </h1>
          </div>
          <p className="text-sm md:text-base text-gray-600 font-medium">Explore pure and authentic items for your spiritual rituals.</p>
          
          {searchQuery && (
            <div className="mt-4 inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-[#8b1818] px-4 py-2 rounded-sm font-bold shadow-sm text-sm">
              <Search className="w-4 h-4" />
              Showing results for: "{searchQuery}"
            </div>
          )}
        </div>

        {/* MAIN LAYOUT */}
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
          
          {/* =========================================
              LEFT SIDEBAR (FILTERS)
              FIX: Changed 'sticky top-24' to 'relative lg:sticky lg:top-24'
          ========================================= */}
          <div className="w-full lg:w-1/4 flex flex-col gap-6 relative lg:sticky lg:top-24 z-10 animate-fade-up">
            
            <div className="bg-white p-5 md:p-6 rounded-sm shadow-sm border border-orange-50">
              <div className="flex items-center gap-2 mb-4 md:mb-6 border-b border-gray-100 pb-3 md:pb-4">
                <SlidersHorizontal className="w-5 h-5 text-[#f7941d]" />
                <h2 className="text-lg md:text-xl font-extrabold text-gray-800 uppercase tracking-wide">Filters</h2>
              </div>

              <div>
                <h3 className="font-bold text-[#8b1818] mb-3 uppercase text-xs md:text-sm tracking-wider">Categories</h3>
                {/* FIX: Added max-height and custom scrollbar so list doesn't get too long */}
                <div className="flex flex-col gap-1.5 max-h-[250px] lg:max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
                  {(categories.length > 0 ? categories : ['All', selectedCategory !== 'All' ? selectedCategory : null].filter(Boolean)).map((cat, index) => (
                    <button
                      key={index}
                      onClick={() => handleSidebarCategoryClick(cat)}
                      className={`flex items-center justify-between text-left px-3 py-2.5 rounded-sm font-medium transition-all duration-300 border-l-[3px] text-sm md:text-base ${
                        selectedCategory.toLowerCase() === cat.toLowerCase()
                          ? 'bg-orange-50 border-[#f7941d] text-[#8b1818] font-bold' 
                          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-[#8b1818]'
                      }`}
                    >
                      <span className="truncate pr-2">{cat}</span>
                      {selectedCategory.toLowerCase() === cat.toLowerCase() && <ChevronRight className="w-4 h-4 flex-shrink-0 text-[#f7941d]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Need Help Box */}
            <div className="bg-gradient-to-br from-[#8b1818] to-[#6e1313] p-5 md:p-6 rounded-sm shadow-md text-white">
              <h3 className="font-extrabold text-base md:text-lg mb-2">Need Help?</h3>
              <p className="text-xs md:text-sm text-white/80 mb-4">Can't find what you are looking for? Contact our support.</p>
              <a href="tel:+919123187724" className="inline-block bg-white text-[#8b1818] font-bold py-2 px-4 rounded-sm text-xs md:text-sm hover:bg-[#f7941d] hover:text-white transition-colors w-full text-center">
                Call +91 91231 87724
              </a>
            </div>

          </div>

          {/* =========================================
              RIGHT SIDE (PRODUCTS GRID & SORT)
          ========================================= */}
          <div className="w-full lg:w-3/4 animate-fade-up">
            
            {/* FIX: Mobile-friendly top toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-sm shadow-sm border border-orange-50 mb-6 gap-4">
              <div className="font-bold text-gray-600 text-sm md:text-base">
                Showing <span className="text-[#8b1818]">{filteredProducts.length}</span> products
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <label className="font-bold text-gray-600 text-xs md:text-sm uppercase whitespace-nowrap">Sort By:</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto bg-[#fcfaf5] border border-gray-200 text-gray-800 font-bold text-xs md:text-sm rounded-sm focus:ring-[#f7941d] focus:border-[#f7941d] block p-2 md:p-2.5 outline-none cursor-pointer"
                >
                  <option value="default">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* LOADING STATE */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-sm h-[350px] md:h-[380px] animate-pulse border border-orange-50 shadow-sm">
                    <div className="w-full h-48 md:h-56 bg-orange-100/50"></div>
                    <div className="p-4 md:p-5 space-y-4">
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
              <div className="bg-red-50 text-red-600 font-bold p-6 rounded-sm border border-red-100 text-center text-sm md:text-base">
                {error}
              </div>
            )}

            {/* EMPTY RESULTS STATE */}
            {!loading && !error && filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 md:py-20 px-4 bg-white rounded-sm shadow-sm border border-orange-50 text-center">
                <X className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mb-4" />
                <p className="text-gray-800 text-xl md:text-2xl font-extrabold mb-2">No items found</p>
                <p className="text-gray-500 font-medium text-sm md:text-base">
                  {searchQuery ? `We couldn't find anything matching "${searchQuery}".` : "This category is currently empty."}
                </p>
                <button 
                  onClick={() => { setSelectedCategory('All'); navigate('/shop'); }}
                  className="mt-6 border-[2px] border-[#8b1818] text-[#8b1818] hover:bg-[#8b1818] hover:text-white font-bold py-2 px-6 rounded-sm transition-colors text-sm md:text-base"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* PRODUCT GRID */}
            {!loading && !error && filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </div>
            )}

          </div>
        </div>

        {/* TRENDING BANNER (Outside the flex layout, looks good on mobile too) */}
        <div className="mt-12 md:mt-16">
          <TrendingBanner />
        </div>
      </div>
    </div>
  );
};

export default Shop;