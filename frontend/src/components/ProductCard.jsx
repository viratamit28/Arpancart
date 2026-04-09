import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom'; 
import { ShoppingCart, CheckCircle } from 'lucide-react';

const ProductCard = ({ product }) => {
  const cartContext = useContext(CartContext); 
  const [isAdded, setIsAdded] = useState(false);

  // Advanced Add to Cart logic with Premium UI Feedback
  const handleAddToCart = (e) => {
    e.preventDefault(); // Link click ko block karne ke liye taaki page navigate na ho
    e.stopPropagation();

    // Context se function call karo
    if (cartContext.addToCart) {
      cartContext.addToCart(product);
    } else if (cartContext.setCartItems) {
      // Fallback agar tumne seedha setCartItems export kiya hai
      cartContext.setCartItems(prev => {
        const existingItem = prev.find(item => (item.id || item._id) === (product.id || product._id));
        if (existingItem) {
          return prev.map(item => (item.id || item._id) === (product.id || product._id) ? { ...item, quantity: item.quantity + 1 } : item);
        }
        return [...prev, { ...product, quantity: 1 }];
      });
    }

    // Button ko Green karke "Added" dikhane ka animation
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    // Sharp edges (rounded-sm) aur premium hover shadow
    <div className="bg-white rounded-sm p-0 shadow-sm hover:shadow-[0_15px_35px_rgba(139,24,24,0.1)] transition-all duration-500 border border-orange-50 flex flex-col group h-full">
      
      {/* =========================================
          IMAGE AREA (Clickable Link)
      ========================================= */}
      <Link to={`/product/${product.id || product._id}`} className="relative w-full h-56 overflow-hidden rounded-t-sm bg-[#fffbf4] block cursor-pointer">
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10"></div>
        <img 
          src={product.imageUrl || "https://www.pexels.com/photo/close-up-photo-of-puja-thali-set-7686352/"} 
          alt={product.title || product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        
        {/* Category Badge - Sharp cut */}
        <span className="absolute top-3 left-3 bg-white/95 text-[#8b1818] text-[10px] font-extrabold px-3 py-1.5 rounded-sm shadow-sm uppercase tracking-wider z-20">
          {product.category}
        </span>

        {/* Sale Badge (Agar discount hai toh) */}
        {product.discountedPrice && product.price > product.discountedPrice && (
          <span className="absolute top-3 right-3 bg-gradient-to-r from-[#c21820] to-[#8b1818] text-white text-[10px] font-extrabold px-3 py-1.5 rounded-sm shadow-md uppercase tracking-wider z-20">
            Sale
          </span>
        )}
      </Link>

      {/* =========================================
          DETAILS & ACTION AREA
      ========================================= */}
      <div className="p-5 flex flex-col flex-grow text-center">
        
        <Link to={`/product/${product.id || product._id}`} className="w-full text-center mb-2">
          <h3 className="font-extrabold text-gray-800 text-lg line-clamp-1 group-hover:text-[#c21820] transition-colors cursor-pointer" title={product.title || product.name}>
            {product.title || product.name}
          </h3>
        </Link>
        
        {/* Pricing Area */}
        <div className="flex justify-center items-center gap-2 mb-6 mt-auto">
          {product.discountedPrice ? (
            <>
              <span className="text-[22px] font-extrabold text-[#8b1818]">₹{product.discountedPrice}</span>
              <span className="text-sm font-bold text-gray-400 line-through">₹{product.price}</span>
            </>
          ) : (
            <span className="text-[22px] font-extrabold text-[#8b1818]">₹{product.price}</span>
          )}
        </div>
        
        {/* =========================================
            ADD TO CART BUTTON (Sharp & Interactive)
        ========================================= */}
        <button 
          onClick={handleAddToCart} 
          disabled={isAdded}
          className={`w-full font-extrabold text-sm py-3.5 rounded-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-sm active:scale-95 ${
            isAdded 
              ? 'bg-green-500 text-white border-none' 
              : 'bg-transparent border-[2px] border-[#8b1818] text-[#8b1818] hover:bg-[#8b1818] hover:text-white'
          }`}
        >
          {isAdded ? (
            <><CheckCircle className="w-4 h-4" /> Added!</>
          ) : (
            <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
          )}
        </button>

      </div>
    </div>
  );
};

export default ProductCard;