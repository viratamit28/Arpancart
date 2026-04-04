import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 👈 React Router add kiya routing ke liye
import Trending from '../assets/2.jpg';

const TrendingBanner = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Navigate hook setup
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

  // 🎯 Button Click Handlers
  const handleShopNowClick = () => {
    navigate('/shop'); // Ye user ko Shop page par le jayega
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); // Ye user ko Product Details page par le jayega
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Ye card click aur button click ko alag rakhega
    // Abhi ke liye ye alert dega. Baad me ise CartContext se jod dena!
    alert(`${product.title || product.name} aapke cart me add ho gaya!`);
  };

  return (
    <div className="py-12 px-6 md:px-12 bg-[#fcfaf5]">
      <div className="max-w-7xl mx-auto">
        
        {/* TITLE SECTION */}
        <div className="flex items-center justify-center mb-8">
          <div className="hidden md:flex items-center">
            <div className="w-16 lg:w-32 h-[1px] bg-[#8b1818] opacity-40"></div>
            <div className="w-1.5 h-1.5 bg-[#8b1818] rounded-full mx-2 opacity-60"></div>
          </div>
          
          <h2 className="text-3xl md:text-[32px] font-bold text-[#8b1818] px-4 text-center tracking-wide">
            Trending Products
          </h2>

          <div className="hidden md:flex items-center">
            <div className="w-1.5 h-1.5 bg-[#8b1818] rounded-full mx-2 opacity-60"></div>
            <div className="w-16 lg:w-32 h-[1px] bg-[#8b1818] opacity-40"></div>
          </div>
        </div>

        {/* BANNER & BUTTON SECTION */}
        <div className="relative w-full h-[200px] md:h-[300px] lg:h-[350px] rounded-md overflow-hidden shadow-md group cursor-pointer mb-12">
          <img 
            src={Trending} 
            alt="Trending Pooja Products Banner" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent"></div>
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <button 
              onClick={handleShopNowClick} // 👈 Click event yahan add kiya
              className="bg-gradient-to-r from-[#9e1010] to-[#c21820] hover:from-[#7a0c0c] hover:to-[#a31212] text-white font-bold text-base md:text-lg py-3 px-8 md:px-12 rounded shadow-[0_4px_15px_rgba(194,24,32,0.5)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-95 border border-[#e62e36]/30"
            >
              Shop Now
            </button>
          </div>
        </div>

        {/* DYNAMIC PRODUCTS GRID SECTION */}
        <div>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8b1818]"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 font-semibold">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {trendingProducts.map((product) => (
                <div 
                  key={product.id || product._id} 
                  onClick={() => handleProductClick(product.id || product._id)} // 👈 Card click setup
                  className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 group cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={product.imageUrl || "https://dummyimage.com/300x300/fcfaf5/8b1818.jpg&text=Pooja+Item"} 
                      alt={product.title || product.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {product.discountedPrice && product.price > product.discountedPrice && (
                      <div className="absolute top-3 left-3 bg-[#8b1818] text-white text-xs font-bold px-2 py-1 rounded">
                        Sale
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-4 text-center">
                    <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">{product.title || product.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{product.category}</p>
                    
                    <div className="flex justify-center items-center gap-2 mb-4">
                      {product.discountedPrice ? (
                        <>
                          <span className="text-xl font-bold text-[#8b1818]">₹{product.discountedPrice}</span>
                          <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-[#8b1818]">₹{product.price}</span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button 
                      onClick={(e) => handleAddToCart(e, product)} // 👈 Cart button setup
                      className="w-full py-2 bg-transparent border border-[#8b1818] text-[#8b1818] font-semibold rounded hover:bg-[#8b1818] hover:text-white transition-colors duration-300"
                    >
                      Add to Cart
                    </button>
                  </div>
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