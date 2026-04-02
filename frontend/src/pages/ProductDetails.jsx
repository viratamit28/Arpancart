import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { ArrowLeft, Truck, ShieldCheck, Leaf, ShoppingCart } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams(); // URL se product id nikalenge
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0); // Top pe scroll karo

    const fetchSingleProduct = async () => {
      try {
        // Hum saare products laa kar usme se ID match kar lenge (Safe approach)
        const response = await axios.get('http://localhost:5000/api/products');
        const allProducts = response.data.data;
        // String to Number convert karna zaroori hai ID match karne ke liye
        const foundProduct = allProducts.find(p => p.id === parseInt(id));
        
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError("Product nahi mila. Shayad link galat hai.");
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

  if (loading) return <div className="min-h-screen bg-[#fcfaf5] flex justify-center items-center text-xl font-bold text-[#8b1818] animate-pulse">Loading Details...</div>;
  if (error) return <div className="min-h-screen bg-[#fcfaf5] flex justify-center items-center text-xl font-bold text-red-500">{error}</div>;
  if (!product) return null;

  return (
    <div className="bg-[#fcfaf5] min-h-screen py-10 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-[#c21820] transition-colors font-bold text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
          </button>
        </div>

        {/* Main Product Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-50 overflow-hidden flex flex-col md:flex-row">
          
          {/* =========================================
              LEFT SIDE: PRODUCT IMAGE
          ========================================= */}
          <div className="w-full md:w-1/2 bg-[#fffbf4] p-8 md:p-12 flex justify-center items-center border-b md:border-b-0 md:border-r border-orange-100">
            <img 
              src={product.imageUrl} 
              alt={product.title} 
              className="w-full max-w-[400px] h-auto object-cover rounded-xl shadow-md mix-blend-multiply hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* =========================================
              RIGHT SIDE: PRODUCT INFO
          ========================================= */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            
            {/* Category Badge */}
            <span className="bg-orange-100 text-[#8b1818] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider w-fit mb-4 border border-orange-200">
              {product.category || "Pooja Samagri"}
            </span>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4 leading-tight">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-end gap-2 mb-6">
              <span className="text-4xl font-extrabold text-[#c21820]">₹{product.price}</span>
              <span className="text-gray-400 font-medium line-through mb-1">₹{Math.round(product.price * 1.2)}</span>
              <span className="text-green-600 font-bold text-sm mb-1 ml-2">(20% OFF)</span>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-gray-100 mb-6"></div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="font-bold text-gray-800 mb-2">Product Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description || "This premium pooja samagri is carefully selected to ensure purity and authenticity for your daily rituals and special occasions."}
              </p>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <div className="flex items-center gap-3">
                <div className="bg-orange-50 p-2 rounded-full text-[#f7941d]"><Leaf className="w-5 h-5"/></div>
                <span className="text-xs font-bold text-gray-700">100% Pure &<br/>Authentic</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-orange-50 p-2 rounded-full text-[#f7941d]"><ShieldCheck className="w-5 h-5"/></div>
                <span className="text-xs font-bold text-gray-700">Premium<br/>Quality</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-orange-50 p-2 rounded-full text-[#f7941d]"><Truck className="w-5 h-5"/></div>
                <span className="text-xs font-bold text-gray-700">Fast & Secure<br/>Delivery</span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={() => addToCart(product)}
              className="w-full flex items-center justify-center gap-3 bg-[#8b1818] hover:bg-[#6e1313] text-white font-bold text-lg py-4 rounded-lg shadow-[0_8px_20px_rgba(139,24,24,0.2)] transition-all duration-300 hover:shadow-lg active:scale-95"
            >
              <ShoppingCart className="w-6 h-6" /> Add to Cart
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;