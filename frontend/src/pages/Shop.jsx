import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import TrendingBanner from '../components/TrendingBanner';
import { SlidersHorizontal, Search, X, ChevronRight, Sparkles, Flame, Star, LayoutGrid } from 'lucide-react';

const Shop = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  
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
  const isTrending = searchParams.get('trending') === 'true';
  const isPopular = searchParams.get('popular') === 'true';

  // 1. Fetch Products & Categories
  useEffect(() => {
    window.scrollTo(0, 0); 
    
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/products'),
          axios.get('http://localhost:5000/api/categories').catch(() => null) 
        ]);
        
        let productsArray = [];
        if (Array.isArray(productsRes.data)) productsArray = productsRes.data;
        else if (productsRes.data?.products) productsArray = productsRes.data.products;
        else if (productsRes.data?.data) productsArray = productsRes.data.data;

        setAllProducts(productsArray); 
        
        if (categoriesRes && categoriesRes.data?.success) {
          const activeCategories = categoriesRes.data.data.filter(c => c.isActive !== false).map(c => c.name);
          setCategories(['All', ...activeCategories]);
        } else {
          const uniqueCategories = ['All', ...new Set(productsArray.map(p => p.categoryString || p.category?.name || p.category).filter(Boolean))];
          setCategories(uniqueCategories);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching shop data:", err);
        setError("Products load nahi ho paye. Please check your internet connection.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 2. Sync URL Context with State
  useEffect(() => {
    if (urlCategory) setSelectedCategory(urlCategory);
    else setSelectedCategory('All');
  }, [urlCategory]);

  // 3. Apply Filters & Sort
  useEffect(() => {
    let result = [...allProducts];

    // Search Filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(p => {
        const catName = p.category?.name || p.categoryString || p.category || '';
        return (
          (p.title && p.title.toLowerCase().includes(lowerQuery)) || 
          (catName.toLowerCase().includes(lowerQuery))
        );
      });
    }

    // Contextual Filters (Trending / Popular)
    if (isTrending) {
      result = result.filter(p => p.isTrending === true);
    } else if (isPopular) {
      // Mock popular sorting (Best practice: add isPopular in DB, but for now we slice top rated/viewed)
      result = result.slice(0, 12); 
    }

    // Category Filter
    if (!isTrending && !isPopular && selectedCategory !== 'All') {
      result = result.filter(p => {
        const dbCategory = (p.category?.name || p.categoryString || p.category || '').toLowerCase().trim();
        const targetCategory = selectedCategory.toLowerCase().trim();
        return dbCategory.includes(targetCategory) || targetCategory.includes(dbCategory);
      });
    }

    // Sorting Filter
    const getSafePrice = (p) => (p.discountedPrice && p.discountedPrice > 0) ? p.discountedPrice : p.price;
    if (sortBy === 'price-low') result.sort((a, b) => getSafePrice(a) - getSafePrice(b));
    else if (sortBy === 'price-high') result.sort((a, b) => getSafePrice(b) - getSafePrice(a));

    setFilteredProducts(result);
  }, [allProducts, searchQuery, selectedCategory, sortBy, isTrending, isPopular]);

  // 4. Handle Clicks
  const handleSidebarCategoryClick = (cat) => {
    if (cat === 'All') navigate('/shop');
    else navigate(`/shop?category=${encodeURIComponent(cat)}`);
  };

  // 🔥 5. DYNAMIC HEADER CONFIGURATION
  let pageHeader = {
    title: "Pooja Samagri Collection",
    subtitle: "Explore pure and authentic items organized perfectly for your spiritual rituals.",
    icon: <Sparkles className="w-8 h-8 text-[#f7941d]" />,
    gradient: "from-[#8b1818] to-[#5a0f0f]"
  };

  if (isTrending) {
    pageHeader = {
      title: "Trending Spiritual Essentials",
      subtitle: "Season's most loved and highly requested divine items.",
      icon: <Flame className="w-8 h-8 text-[#f7941d] animate-pulse" />,
      gradient: "from-[#f7941d] to-[#c26f12]"
    };
  } else if (isPopular) {
    pageHeader = {
      title: "Most Loved Best Sellers",
      subtitle: "Our highest rated and most trusted pooja essentials chosen by devotees.",
      icon: <Star className="w-8 h-8 text-[#f7941d]" />,
      gradient: "from-[#c21820] to-[#8b1818]"
    };
  } else if (urlCategory) {
    pageHeader = {
      title: `${urlCategory} Collection`,
      subtitle: `Explore our premium range of authentic ${urlCategory}.`,
      icon: <LayoutGrid className="w-8 h-8 text-[#f7941d]" />,
      gradient: "from-[#8b1818] to-[#5a0f0f]"
    };
  }

  // 🔥 6. SMART CATEGORY GROUPING LOGIC
  // Agar "All" selected hai, aur Trending/Popular/Search nahi hai, toh products ko category wise dikhao
  const shouldGroupByCategory = selectedCategory === 'All' && !isTrending && !isPopular && !searchQuery;

  const groupedProducts = {};
  if (shouldGroupByCategory) {
    categories.filter(c => c !== 'All').forEach(cat => {
      const prodsForCat = filteredProducts.filter(p => {
        const dbCategory = (p.category?.name || p.categoryString || p.category || '').toLowerCase().trim();
        return dbCategory.includes(cat.toLowerCase().trim()) || cat.toLowerCase().trim().includes(dbCategory);
      });
      if (prodsForCat.length > 0) groupedProducts[cat] = prodsForCat;
    });
  }

  return (
    <div className="bg-[#fcfaf5] min-h-screen pb-12">
      
      <style>
        {`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-up { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: #fffbf4; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #f7941d; border-radius: 4px; }
        `}
      </style>

      {/* =========================================
          🔥 DYNAMIC MODERN BANNER
      ========================================= */}
      <div className={`w-full py-16 px-4 flex flex-col items-center justify-center text-center bg-gradient-to-r ${pageHeader.gradient} text-white shadow-md mb-10`}>
        <div className="animate-fade-up flex flex-col items-center">
          <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm mb-4 shadow-inner">
            {pageHeader.icon}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold uppercase tracking-widest drop-shadow-md mb-3">
            {pageHeader.title}
          </h1>
          <p className="text-sm md:text-lg text-white/90 font-medium max-w-2xl">
            {pageHeader.subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
        
        {/* Search Indicator */}
        {searchQuery && (
          <div className="mb-6 flex justify-center animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-white border border-orange-200 text-[#8b1818] px-6 py-3 rounded-full font-bold shadow-sm text-sm">
              <Search className="w-4 h-4" /> Showing results for: "{searchQuery}"
              <button onClick={() => navigate('/shop')} className="ml-2 bg-orange-100 p-1 rounded-full hover:bg-orange-200 transition-colors"><X className="w-3 h-3"/></button>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* =========================================
              LEFT SIDEBAR (FILTERS)
          ========================================= */}
          <div className="w-full lg:w-1/4 flex flex-col gap-6 relative lg:sticky lg:top-24 z-10 animate-fade-up">
            <div className="bg-white p-5 md:p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-orange-50">
              <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <SlidersHorizontal className="w-5 h-5 text-[#f7941d]" />
                <h2 className="text-lg font-extrabold text-gray-800 uppercase tracking-wide">Filters</h2>
              </div>

              <div>
                <h3 className="font-extrabold text-[#8b1818] mb-3 uppercase text-xs tracking-wider">Categories</h3>
                <div className="flex flex-col gap-1.5 max-h-[250px] lg:max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
                  {categories.map((cat, index) => (
                    <button
                      key={index}
                      onClick={() => handleSidebarCategoryClick(cat)}
                      className={`flex items-center justify-between text-left px-3 py-2.5 rounded-lg font-medium transition-all duration-300 text-sm ${
                        (!isTrending && !isPopular && selectedCategory.toLowerCase() === cat.toLowerCase())
                          ? 'bg-gradient-to-r from-orange-50 to-transparent border-l-4 border-[#f7941d] text-[#8b1818] font-bold' 
                          : 'border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:text-[#8b1818]'
                      }`}
                    >
                      <span className="truncate pr-2">{cat}</span>
                      {(!isTrending && !isPopular && selectedCategory.toLowerCase() === cat.toLowerCase()) && <ChevronRight className="w-4 h-4 flex-shrink-0 text-[#f7941d]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#8b1818] to-[#6e1313] p-6 rounded-xl shadow-lg text-white text-center">
              <h3 className="font-extrabold text-lg mb-2">Need Guidance?</h3>
              <p className="text-xs text-white/80 mb-4 leading-relaxed">Not sure what samagri you need for your pooja? We are here to help.</p>
              <a href="tel:+919123187724" className="inline-block bg-white text-[#8b1818] font-extrabold py-2.5 px-4 rounded-sm text-sm hover:bg-[#f7941d] hover:text-white transition-colors w-full shadow-md">
                Call +91 91231 87724
              </a>
            </div>
          </div>

          {/* =========================================
              RIGHT SIDE (PRODUCTS AREA)
          ========================================= */}
          <div className="w-full lg:w-3/4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-orange-50 mb-8 gap-4">
              <div className="font-bold text-gray-600 text-sm">
                Showing <span className="text-[#8b1818] text-lg">{filteredProducts.length}</span> products
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <label className="font-bold text-gray-600 text-xs uppercase whitespace-nowrap">Sort By:</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto bg-[#fcfaf5] border border-gray-200 text-gray-800 font-bold text-sm rounded-md focus:ring-[#f7941d] focus:border-[#f7941d] block p-2.5 outline-none cursor-pointer"
                >
                  <option value="default">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* LOADING STATE */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-2xl h-[400px] animate-pulse border border-orange-50 shadow-sm">
                    <div className="w-full h-56 bg-orange-50/50 rounded-t-2xl"></div>
                    <div className="p-5 space-y-4">
                      <div className="h-5 bg-gray-200 w-3/4 rounded-sm"></div>
                      <div className="h-4 bg-gray-100 w-1/2 rounded-sm"></div>
                      <div className="h-12 bg-gray-200 mt-6 rounded-xl"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ERROR STATE */}
            {error && (
              <div className="bg-red-50 text-red-600 font-bold p-6 rounded-xl border border-red-100 text-center">
                {error}
              </div>
            )}

            {/* EMPTY RESULTS STATE */}
            {!loading && !error && filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-orange-50 text-center">
                <X className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-800 text-2xl font-extrabold mb-2">No items found</p>
                <p className="text-gray-500 font-medium">
                  {searchQuery ? `We couldn't find anything matching "${searchQuery}".` : "This collection is currently empty."}
                </p>
                <button onClick={() => { setSelectedCategory('All'); navigate('/shop'); }} className="mt-6 border-[2px] border-[#8b1818] text-[#8b1818] hover:bg-[#8b1818] hover:text-white font-extrabold py-3 px-8 rounded-sm transition-colors uppercase tracking-wider text-sm shadow-sm">
                  View All Products
                </button>
              </div>
            )}

            {/* =========================================
                PRODUCT RENDERING (Grouped vs Grid)
            ========================================= */}
            {!loading && !error && filteredProducts.length > 0 && (
              <>
                {shouldGroupByCategory ? (
                  // 🔥 GROUPED BY CATEGORY VIEW (Default '/shop' look)
                  <div className="space-y-12">
                    {Object.keys(groupedProducts).map((catName, idx) => (
                      <div key={idx} className="bg-white p-6 rounded-2xl border border-orange-50 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                        <div className="flex justify-between items-end border-b border-gray-100 pb-4 mb-6">
                          <h2 className="text-2xl font-extrabold text-[#8b1818] flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-[#f7941d]"/> {catName}
                          </h2>
                          <button onClick={() => navigate(`/shop?category=${encodeURIComponent(catName)}`)} className="text-sm font-bold text-[#f7941d] hover:text-[#8b1818] transition-colors flex items-center gap-1">
                            See All <ChevronRight className="w-4 h-4"/>
                          </button>
                        </div>
                        {/* Render only top 3 items per category in this view to keep it clean */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                          {groupedProducts[catName].slice(0, 3).map(product => (
                            <ProductCard key={product.id || product._id} product={product} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // 🔥 STANDARD GRID VIEW (For Trending, Popular, or specific Category)
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id || product._id} product={product} />
                    ))}
                  </div>
                )}
              </>
            )}

          </div>
        </div>

        {/* Hide Trending Banner if we are already viewing the Trending Page */}
        {!isTrending && (
          <div className="mt-16 md:mt-24 border-t border-orange-100 pt-8">
            <TrendingBanner />
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;