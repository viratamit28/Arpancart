import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import TrendingBanner from '../components/TrendingBanner';
import { Search, X, ChevronRight, Sparkles, ArrowLeft, Filter } from 'lucide-react'; 

const Shop = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Category States
  const [categories, setCategories] = useState(['All']);
  const [fullCategoriesData, setFullCategoriesData] = useState([]); // 🔥 Pura category data (with subcategories) store karne ke liye
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeSubCategory, setActiveSubCategory] = useState(null); // 🔥 Sub-category tracking
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
          axios.get('https://arpancart-production.up.railway.app/api/products'),
          axios.get('https://arpancart-production.up.railway.app/api/categories').catch(() => null) 
        ]);
        
        let productsArray = [];
        if (Array.isArray(productsRes.data)) productsArray = productsRes.data;
        else if (productsRes.data?.products) productsArray = productsRes.data.products;
        else if (productsRes.data?.data) productsArray = productsRes.data.data;

        setAllProducts(productsArray); 
        
        if (categoriesRes && categoriesRes.data?.success) {
          const fetchedCategories = categoriesRes.data.data;
          setFullCategoriesData(fetchedCategories); // Pura data save kiya
          
          const activeCategories = fetchedCategories.filter(c => c.isActive !== false).map(c => c.name);
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
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    } else {
      setSelectedCategory('All');
    }
    // Agar main category change ho, toh sub-category filter reset kar do
    setActiveSubCategory(null);
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

    // 🔥 Sub-Category Filter (Left Sidebar click se)
    if (activeSubCategory) {
      result = result.filter(p => p.subCategoryId === activeSubCategory);
    }

    // Sorting Filter
    const getSafePrice = (p) => (p.discountedPrice && p.discountedPrice > 0) ? p.discountedPrice : p.price;
    if (sortBy === 'price-low') result.sort((a, b) => getSafePrice(a) - getSafePrice(b));
    else if (sortBy === 'price-high') result.sort((a, b) => getSafePrice(b) - getSafePrice(a));

    setFilteredProducts(result);
  }, [allProducts, searchQuery, selectedCategory, activeSubCategory, sortBy, isTrending, isPopular]);

  // 4. Handle Clicks
  const handleMainCategoryClick = (cat) => {
    setActiveSubCategory(null); // Tab change karne par sub-category reset
    if (cat === 'All') navigate('/shop');
    else navigate(`/shop?category=${encodeURIComponent(cat)}`);
  };

  // 5. DYNAMIC HEADER CONFIGURATION
  let pageHeader = { title: "Puja Items & Puja Kits" };
  if (isTrending) pageHeader.title = "Trending Spiritual Essentials";
  else if (isPopular) pageHeader.title = "Most Loved Best Sellers";
  else if (urlCategory) pageHeader.title = `${urlCategory}`;

  // 6. SMART CATEGORY GROUPING LOGIC
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

  // 🔥 7. Find Current Category's Subcategories
  const currentCategoryObj = fullCategoriesData.find(c => c.name.toLowerCase() === selectedCategory.toLowerCase());
  const hasSubCategories = currentCategoryObj && currentCategoryObj.subCategories && currentCategoryObj.subCategories.length > 0;

  return (
    <div className="bg-[#fdfaf6] min-h-screen pb-12">
      <style>
        {`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-up { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 pt-8 md:pt-12">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col mb-8 animate-fade-up">
          <div className="flex items-center gap-4 md:gap-6 mb-8">
            <button 
              onClick={() => navigate(-1)} 
              className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 flex items-center justify-center bg-[#ebdcd3] text-[#6b1a1a] rounded-full hover:bg-[#e0c9ba] transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
            </button>
            <h1 className="text-2xl md:text-[32px] font-bold text-[#6b1a1a] font-serif tracking-wide">
              {pageHeader.title}
            </h1>
          </div>

          {/* HORIZONTAL CATEGORY PILLS (TABS) */}
          {(!isTrending && !isPopular) && (
            <div className="flex overflow-x-auto gap-3 md:gap-4 pb-2 hide-scrollbar w-full">
              {categories.map((cat, index) => {
                const isActive = (!isTrending && !isPopular && selectedCategory.toLowerCase() === cat.toLowerCase());
                return (
                  <button
                    key={index}
                    onClick={() => handleMainCategoryClick(cat)}
                    className={`px-6 md:px-8 py-2.5 md:py-3 rounded-full text-sm md:text-[15px] font-semibold whitespace-nowrap transition-all duration-300 border flex-shrink-0 ${
                      isActive 
                        ? 'bg-[#7a1a1a] text-white border-[#7a1a1a] shadow-md' 
                        : 'bg-white text-gray-800 border-gray-200 hover:border-[#7a1a1a] shadow-sm'
                    }`}
                  >
                    {cat === 'All' ? 'All Puja Items' : cat}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Search Indicator */}
        {searchQuery && (
          <div className="mb-6 flex animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-white border border-orange-200 text-[#8b1818] px-6 py-3 rounded-full font-bold shadow-sm text-sm">
              <Search className="w-4 h-4" /> Showing results for: "{searchQuery}"
              <button onClick={() => navigate('/shop')} className="ml-2 bg-orange-100 p-1 rounded-full hover:bg-orange-200 transition-colors"><X className="w-3 h-3"/></button>
            </div>
          </div>
        )}

        {/* =========================================
            🔥 MAIN LAYOUT (SIDEBAR + PRODUCTS GRID)
        ========================================= */}
        <div className="flex flex-col lg:flex-row gap-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          
          {/* LEFT SIDEBAR (Sub-Category Filters) - Appears only if subcategories exist */}
          {hasSubCategories && !isTrending && !isPopular && (
            <aside className="w-full lg:w-1/4 xl:w-1/5 flex-shrink-0">
              <div className="bg-white p-5 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-orange-50 sticky top-24">
                <h3 className="font-extrabold text-gray-800 uppercase tracking-wide mb-4 flex items-center gap-2 text-sm">
                  <Filter className="w-4 h-4 text-[#f7941d]"/> Filters by Kit
                </h3>
                
                <ul className="space-y-2">
                  <li>
                    <button 
                      onClick={() => setActiveSubCategory(null)}
                      className={`w-full text-left px-4 py-2.5 text-sm font-bold rounded-lg transition-colors ${activeSubCategory === null ? 'bg-[#fcfaf5] text-[#8b1818] border border-[#8b1818]/20' : 'text-gray-600 hover:bg-gray-50 border border-transparent'}`}
                    >
                      View All {selectedCategory}
                    </button>
                  </li>
                  
                  {currentCategoryObj.subCategories.map(sub => (
                    <li key={sub.id}>
                      <button 
                        onClick={() => setActiveSubCategory(sub.id)}
                        className={`w-full text-left px-4 py-2.5 text-sm font-bold rounded-lg transition-colors ${activeSubCategory === sub.id ? 'bg-[#f7941d] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 border border-transparent'}`}
                      >
                        {sub.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}

          {/* RIGHT SIDE (Products Area) */}
          <div className="flex-1 w-full">
            
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 md:p-5 rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-orange-50 mb-8 gap-4">
              <div className="font-bold text-gray-600 text-sm">
                Showing <span className="text-[#8b1818] text-lg">{filteredProducts.length}</span> products
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <label className="font-bold text-gray-600 text-xs uppercase whitespace-nowrap">Sort By:</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto bg-[#fdfaf6] border border-gray-200 text-gray-800 font-bold text-sm rounded-lg focus:ring-[#8b1818] focus:border-[#8b1818] block p-2.5 outline-none cursor-pointer"
                >
                  <option value="default">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* LOADING STATE */}
            {loading && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <div key={n} className="bg-white rounded-2xl h-[340px] animate-pulse border border-orange-50 shadow-sm">
                    <div className="w-full h-48 bg-orange-50/50 rounded-t-2xl"></div>
                    <div className="p-5 space-y-4">
                      <div className="h-4 bg-gray-200 w-3/4 rounded-sm"></div>
                      <div className="h-3 bg-gray-100 w-1/2 rounded-sm"></div>
                      <div className="h-10 bg-gray-200 mt-4 rounded-full"></div>
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
                  {searchQuery ? `We couldn't find anything matching "${searchQuery}".` : "No products available in this section."}
                </p>
                <button onClick={() => { setActiveSubCategory(null); setSelectedCategory('All'); navigate('/shop'); }} className="mt-6 bg-[#8b1818] text-white font-extrabold py-3 px-8 rounded-full transition-colors uppercase tracking-wider text-sm shadow-md hover:shadow-lg active:scale-95">
                  View All Products
                </button>
              </div>
            )}

            {/* PRODUCT RENDERING */}
            {!loading && !error && filteredProducts.length > 0 && (
              <>
                {shouldGroupByCategory ? (
                  // GROUPED BY CATEGORY VIEW
                  <div className="space-y-12">
                    {Object.keys(groupedProducts).map((catName, idx) => (
                      <div key={idx} className="bg-white p-4 md:p-6 rounded-2xl border border-orange-50 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                        <div className="flex justify-between items-end border-b border-gray-100 pb-4 mb-6">
                          <h2 className="text-xl md:text-2xl font-extrabold text-[#8b1818] flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-[#f7941d]"/> {catName}
                          </h2>
                          <button onClick={() => navigate(`/shop?category=${encodeURIComponent(catName)}`)} className="text-sm font-bold text-[#f7941d] hover:text-[#8b1818] transition-colors flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-full">
                            See All <ChevronRight className="w-4 h-4"/>
                          </button>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                          {groupedProducts[catName].slice(0, 4).map(product => (
                            <ProductCard key={product.id || product._id} product={product} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // STANDARD GRID VIEW (Uses 3 cols on large screens because sidebar takes 1 col)
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id || product._id} product={product} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Need Guidance Box */}
        {!loading && !error && (
           <div className="mt-12 bg-[#8b1818] md:bg-gradient-to-r md:from-[#8b1818] md:to-[#6e1313] p-6 md:p-10 rounded-2xl shadow-lg text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-extrabold text-xl md:text-2xl mb-2">Need Guidance?</h3>
              <p className="text-sm text-white/80 leading-relaxed">Not sure what samagri you need for your pooja? Our experts are here to help you.</p>
            </div>
            <a href="tel:+919123187724" className="bg-white text-[#8b1818] font-extrabold py-3 px-8 rounded-full hover:bg-[#f7941d] hover:text-white transition-all whitespace-nowrap shadow-md active:scale-95">
              Call +91 91231 87724
            </a>
          </div>
        )}

        {/* Hide Trending Banner if we are already viewing the Trending Page */}
        {!isTrending && (
          <div className="mt-16 border-t border-orange-100 pt-8">
            <TrendingBanner />
          </div>
        )}

      </div>
    </div>
  );
};

export default Shop;