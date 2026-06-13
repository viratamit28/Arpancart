import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom'; 
import { ShoppingCart, CheckCircle, XCircle, Star } from 'lucide-react';

const ProductCard = ({ product }) => {
  const cartContext = useContext(CartContext); 
  const [isAdded, setIsAdded] = useState(false);

  const defaultImage = "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=800&auto=format&fit=crop";

  const handleAddToCart = (e) => {
    e.preventDefault(); 
    e.stopPropagation();

    if (!cartContext) return;

    if (cartContext.addToCart) {
      cartContext.addToCart(product);
    } else if (cartContext.setCartItems) {
      cartContext.setCartItems(prev => {
        const existingItem = prev.find(item => (item.id || item._id) === (product.id || product._id));
        if (existingItem) {
          return prev.map(item => (item.id || item._id) === (product.id || product._id) ? { ...item, quantity: item.quantity + 1 } : item);
        }
        return [...prev, { ...product, quantity: 1 }];
      });
    }

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const isOutOfStock = product.stockQuantity === 0 || product.stockQuantity === '0';

  return (
    // ✨ Premium Card Container with Smooth Floating Effect
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-orange-50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(139,24,24,0.12)] hover:border-orange-200 hover:-translate-y-1.5 transition-all duration-500 flex flex-col h-full">
      
      {/* =========================================
          ✨ IMAGE AREA (With Smooth Zoom & Badges)
      ========================================= */}
      <Link to={`/product/${product.id || product._id}`} className="relative w-full h-64 overflow-hidden bg-[#fdfbf7] block cursor-pointer p-4">
        {/* Subtle background glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f7941d]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
        
        <img 
          src={product.imageUrl || defaultImage} 
          alt={product.title || product.name || 'Spiritual Item'} 
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-110 relative z-10" 
          onError={(e) => { e.target.src = defaultImage; }} 
        />
        
        {/* Glassmorphism Category Badge */}
        {product.category && (
          <span className="absolute top-3 left-3 bg-white/80 backdrop-blur-md border border-white/50 text-[#8b1818] text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-sm uppercase tracking-widest z-20 transition-transform group-hover:-translate-y-1">
            {product.category}
          </span>
        )}

        {/* Floating Sale Badge */}
        {product.discountedPrice && product.price > product.discountedPrice && !isOutOfStock && (
          <span className="absolute top-3 right-3 bg-gradient-to-tr from-[#c21820] to-[#8b1818] text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-[0_4px_10px_rgba(139,24,24,0.3)] uppercase tracking-widest z-20 animate-pulse">
            Sale
          </span>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-30 flex items-center justify-center">
            <span className="bg-gray-900 text-white font-extrabold px-5 py-2.5 rounded-full uppercase tracking-widest text-xs shadow-xl">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* =========================================
          ✨ DETAILS & CONTENT AREA
      ========================================= */}
      <div className="p-5 flex flex-col flex-grow bg-white relative z-20">
        
        {/* Ratings (Trust Factor) */}
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-3.5 h-3.5 fill-[#f7941d] text-[#f7941d]" />
          ))}
          <span className="text-[11px] text-gray-400 font-bold ml-1 tracking-wider">(4.8)</span>
        </div>
        
        {/* Product Title */}
        <Link to={`/product/${product.id || product._id}`} className="w-full mb-1">
          <h3 className="font-bold text-gray-800 text-[17px] leading-snug line-clamp-2 group-hover:text-[#8b1818] transition-colors cursor-pointer" title={product.title || product.name}>
            {product.title || product.name}
          </h3>
        </Link>

        {/* ✨ Golden Expanding Divider */}
        <div className="w-10 h-[2px] bg-gradient-to-r from-[#f7941d] to-[#ffb86c] my-3 rounded-full opacity-70 group-hover:w-full transition-all duration-500 ease-out"></div>
        
        <div className="mt-auto pt-1">
          {/* Pricing Area */}
          <div className="flex items-end gap-2 mb-4">
            {product.discountedPrice && product.price > product.discountedPrice ? (
              <>
                <span className="text-2xl font-black text-[#8b1818] tracking-tight">₹{product.discountedPrice}</span>
                <span className="text-sm font-bold text-gray-400 line-through mb-1">₹{product.price}</span>
              </>
            ) : (
              <span className="text-2xl font-black text-[#8b1818] tracking-tight">₹{product.price}</span>
            )}
          </div>
          
          {/* =========================================
              ✨ MORPHING ADD TO CART BUTTON
          ========================================= */}
          <button 
            onClick={handleAddToCart} 
            disabled={isAdded || isOutOfStock}
            className={`w-full font-extrabold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-500 active:scale-95 ${
              isOutOfStock 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : isAdded 
                  ? 'bg-green-500 text-white shadow-[0_8px_20px_rgba(34,197,94,0.3)]' 
                  : 'bg-gradient-to-r from-orange-50 to-orange-100 text-[#8b1818] border border-orange-200 group-hover:from-[#8b1818] group-hover:to-[#c21820] group-hover:text-white group-hover:border-transparent group-hover:shadow-[0_8px_20px_rgba(139,24,24,0.3)]'
            }`}
          >
            {isOutOfStock ? (
              <><XCircle className="w-5 h-5" /> Out of Stock</>
            ) : isAdded ? (
              <><CheckCircle className="w-5 h-5 animate-bounce" /> Added to Cart</>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5 transition-transform group-hover:-rotate-12" /> 
                Add to Cart
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;