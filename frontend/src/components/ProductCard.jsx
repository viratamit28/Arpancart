import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom'; // 🚨 Link import karna zaroori hai

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext); 

  return (
    // Blueprint jaisi clean white card styling
    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 border border-gray-100 flex flex-col items-center group">
      
      {/* =========================================
          IMAGE AREA (Wrapped in Link to make it clickable)
      ========================================= */}
      <Link to={`/product/${product.id}`} className="relative w-full h-48 md:h-56 overflow-hidden rounded mb-4 bg-[#fcfaf5] block cursor-pointer">
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        {/* Clean Category Badge */}
        <span className="absolute top-2 left-2 bg-white/95 text-[#8b1818] text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
          {product.category}
        </span>
      </Link>

      {/* =========================================
          TITLE AREA (Wrapped in Link to make it clickable)
      ========================================= */}
      <Link to={`/product/${product.id}`} className="w-full text-center">
        <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-1 hover:text-[#c21820] transition-colors cursor-pointer" title={product.title}>
          {product.title}
        </h3>
      </Link>
      
      {/* Price (Bada aur bold UI ke hisaab se) */}
      <p className="text-[26px] font-extrabold text-gray-900 mb-5">
        <span className="text-lg font-bold text-gray-600 mr-1">₹</span>
        {product.price}
      </p>
      
      {/* Full Width 'Add to Cart' Button (Maroon to Orange hover) */}
      <button 
        onClick={() => addToCart(product)} 
        className="w-full bg-gradient-to-r from-[#8b1818] to-[#a31c1c] hover:from-[#f7941d] hover:to-[#e0861a] text-white font-bold text-base py-3 rounded shadow-md transition-all duration-300 hover:shadow-lg active:scale-95 z-10 relative"
      >
        Add to Cart
      </button>

    </div>
  );
};

export default ProductCard;