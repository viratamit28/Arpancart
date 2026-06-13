import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { ArrowLeft, Truck, ShieldCheck, Leaf, ShoppingCart, CheckCircle2, Check, Share2, Copy, MessageCircle, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard'; 

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAdded, setIsAdded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);

    const fetchSingleProduct = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        
        let allProducts = [];
        if (Array.isArray(response.data)) allProducts = response.data;
        else if (response.data?.products) allProducts = response.data.products;
        else if (response.data?.data) allProducts = response.data.data;
        
        const foundProduct = allProducts.find(p => p.id === parseInt(id));
        
        if (foundProduct) {
          setProduct(foundProduct);
          
          const targetCategory = foundProduct.category || foundProduct.categoryString || '';
          const related = allProducts.filter(p => 
            p.id !== foundProduct.id && 
            (p.category === targetCategory || p.categoryString === targetCategory)
          ).slice(0, 4); 
          
          setRelatedProducts(related);
        } else {
          setError("Product not found. Please check the URL.");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Network error. Please try again.");
        setLoading(false);
      }
    };

    fetchSingleProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000); 
  };

  const shareOnWhatsApp = () => {
    const url = window.location.href;
    const text = `Check out this divine ${product.title} on ArpanCart! 🙏\n\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const copyProductLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fcfaf5] to-white flex flex-col justify-center items-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-orange-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#8b1818] rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-6 text-[#8b1818] font-bold tracking-widest uppercase text-xs animate-pulse flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Unveiling Divine Items...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fcfaf5] flex justify-center items-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-100 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <button onClick={() => navigate('/')} className="bg-[#8b1818] text-white px-6 py-3 rounded-xl font-bold w-full hover:bg-red-900 transition-colors">
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const descriptionText = product.discription || product.description || "";
  const itemsIncluded = descriptionText
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0);

  const hasDiscount = product.discountedPrice && product.discountedPrice < product.price;
  const displayPrice = hasDiscount ? product.discountedPrice : product.price;
  const originalPrice = product.price;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : 0;

  return (
    <div className="bg-gradient-to-b from-[#fcfaf5] to-white min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* PREMIUM BACK BUTTON */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center text-gray-500 hover:text-[#8b1818] transition-all duration-300 font-bold text-sm bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-full border border-gray-200/60 shadow-sm hover:shadow-md w-fit"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
            Back to Collection
          </button>
        </div>

        {/* ============================== */}
        {/* PREMIUM PRODUCT DETAILS CARD   */}
        {/* ============================== */}
        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-orange-50 overflow-hidden flex flex-col lg:flex-row mb-20">
          
          {/* IMAGE SECTION (With subtle glow background) */}
          <div className="w-full lg:w-1/2 relative p-8 lg:p-16 flex justify-center items-center bg-gradient-to-br from-orange-50/80 via-[#fffbf4] to-white">
            {hasDiscount && (
              <div className="absolute top-8 left-8 bg-gradient-to-r from-[#f7941d] to-[#e67e22] text-white text-xs font-extrabold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg shadow-orange-500/30 z-10 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> {discountPercent}% OFF
              </div>
            )}
            
            {/* Soft decorative blur circle behind the image */}
            <div className="absolute w-64 h-64 bg-orange-200/40 rounded-full blur-3xl -z-10"></div>
            
            <img 
              src={product.imageUrl || product.imageurl} 
              alt={product.title} 
              className="w-full max-w-[480px] h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>

          {/* DETAILS SECTION */}
          <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center bg-white">
            
            {/* Category Pill */}
            <span className="bg-orange-50/80 text-[#8b1818] text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest w-fit mb-5 border border-orange-100">
              {product.category || product.categoryString || "Pooja Samagri"}
            </span>

            {/* Product Title */}
            <h1 className="text-3xl lg:text-[2.5rem] font-extrabold text-gray-900 mb-6 leading-[1.1] tracking-tight">
              {product.title}
            </h1>

            {/* Price Box with Gradient */}
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8b1818] to-[#d63031]">
                ₹{displayPrice}
              </span>
              {hasDiscount && (
                <div className="flex flex-col">
                  <span className="text-gray-400 font-bold line-through text-lg">₹{originalPrice}</span>
                  <span className="text-green-600 font-extrabold text-sm uppercase tracking-wide">Save {discountPercent}%</span>
                </div>
              )}
            </div>

            <div className="w-full h-[1px] bg-gradient-to-r from-gray-100 via-gray-200 to-transparent mb-8"></div>

            {/* Items Included (Premium List Look) */}
            <div className="mb-10">
              <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-5">
                What's inside the divine pack
              </h3>
              
              {itemsIncluded.length > 0 && itemsIncluded[0].includes(' ') ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                  {itemsIncluded.map((item, index) => (
                    <li key={index} className="flex items-start bg-gray-50/50 p-3 rounded-xl border border-gray-100/50 hover:bg-orange-50/50 transition-colors">
                      <div className="bg-white rounded-full p-1 shadow-sm mr-3 mt-0.5 border border-orange-100">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#f7941d]" />
                      </div>
                      <span className="capitalize text-gray-700 font-semibold text-sm leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 font-medium leading-relaxed text-[15px] bg-gray-50/50 p-5 rounded-2xl border border-gray-100/50">
                  {descriptionText || "A complete, hand-picked premium puja kit containing all essential items required to perform the puja rituals with utmost devotion."}
                </p>
              )}
            </div>

            {/* Features (Modern Soft UI Cards) */}
            <div className="grid grid-cols-3 gap-3 mb-10">
              <div className="flex flex-col items-center text-center gap-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:-translate-y-1 transition-transform duration-300">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#8b1818] mb-1"><Leaf className="w-5 h-5"/></div>
                <span className="text-[10px] font-extrabold text-gray-600 uppercase tracking-widest">100% Pure</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:-translate-y-1 transition-transform duration-300">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#8b1818] mb-1"><ShieldCheck className="w-5 h-5"/></div>
                <span className="text-[10px] font-extrabold text-gray-600 uppercase tracking-widest">Premium</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:-translate-y-1 transition-transform duration-300">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#8b1818] mb-1"><Truck className="w-5 h-5"/></div>
                <span className="text-[10px] font-extrabold text-gray-600 uppercase tracking-widest">Secure</span>
              </div>
            </div>

            {/* ADD TO CART BUTTON (Luxurious Gradient) */}
            <button 
              onClick={handleAddToCart}
              className={`w-full relative overflow-hidden group flex items-center justify-center gap-3 font-extrabold text-[15px] uppercase tracking-widest py-4 rounded-2xl transition-all duration-300 transform active:scale-[0.98] ${
                isAdded 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-[0_8px_20px_rgba(16,185,129,0.3)]' 
                : 'bg-gradient-to-r from-[#8b1818] to-[#b32424] text-white shadow-[0_8px_25px_rgba(139,24,24,0.25)] hover:shadow-[0_12px_30px_rgba(139,24,24,0.35)]'
              }`}
            >
              {/* Button shine effect on hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"></div>
              
              <span className="relative z-20 flex items-center gap-2">
                {isAdded ? (
                  <><Check className="w-5 h-5" /> Added to Cart!</>
                ) : (
                  <><ShoppingCart className="w-5 h-5" /> Add to Cart</>
                )}
              </span>
            </button>

            {/* SOCIAL SHARE LINKS (Premium Pills) */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 border-t border-gray-100 pt-8">
              <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mr-2">
                Spread the word
              </span>
              
              <button 
                onClick={shareOnWhatsApp}
                className="flex items-center gap-2 text-xs font-extrabold text-[#128C7E] bg-[#25D366]/10 hover:bg-[#25D366]/20 px-5 py-2.5 rounded-full transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </button>
              
              <button 
                onClick={copyProductLink}
                className={`flex items-center gap-2 text-xs font-extrabold px-5 py-2.5 rounded-full transition-all duration-300 border ${
                  isCopied 
                  ? 'text-green-700 bg-green-50 border-green-200' 
                  : 'text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border-gray-200 shadow-sm'
                }`}
              >
                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {isCopied ? 'Link Copied!' : 'Copy Link'}
              </button>
            </div>

          </div>
        </div>

        {/* ============================== */}
        {/* RELATED PRODUCTS SECTION       */}
        {/* ============================== */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <span className="text-[#f7941d] font-extrabold tracking-widest text-xs uppercase mb-2 block flex items-center justify-center gap-2">
                <Sparkles className="w-3 h-3" /> Explore More
              </span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                You May Also Like
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {relatedProducts.map((relatedItem) => (
                <div key={relatedItem.id} className="hover:-translate-y-2 transition-transform duration-300">
                  <ProductCard product={relatedItem} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;