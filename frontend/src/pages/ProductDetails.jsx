import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { ArrowLeft, Truck, ShieldCheck, Leaf, ShoppingCart, CheckCircle2 } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchSingleProduct = async () => {
      try {
        const response = await axios.get('https://arpancart.onrender.com/api/products');
        const allProducts = response.data.data;
        
        const foundProduct = allProducts.find(p => p.id === parseInt(id));
        
        if (foundProduct) {
          setProduct(foundProduct);
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

  if (loading) return <div className="min-h-screen bg-[#fcfaf5] flex justify-center items-center text-xl font-bold text-[#8b1818] animate-pulse">Loading Details...</div>;
  if (error) return <div className="min-h-screen bg-[#fcfaf5] flex justify-center items-center text-xl font-bold text-red-500">{error}</div>;
  if (!product) return null;

  // Extract description and split into an array for bullet points
  // Checking both 'discription' and 'description' to avoid typo issues from DB
  const descriptionText = product.discription || product.description || "";
  const itemsIncluded = descriptionText
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0);

  return (
    <div className="bg-[#fcfaf5] min-h-screen py-10 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-[#c21820] transition-colors font-bold text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-orange-50 overflow-hidden flex flex-col md:flex-row">
          
          <div className="w-full md:w-1/2 bg-[#fffbf4] p-8 md:p-12 flex justify-center items-center border-b md:border-b-0 md:border-r border-orange-100 relative">
            <div className="absolute top-6 left-6 bg-[#8b1818] text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider">
              Bestseller Combo
            </div>
            <img 
              src={product.imageUrl || product.imageurl} 
              alt={product.title} 
              className="w-full max-w-[400px] h-auto object-contain rounded-xl drop-shadow-xl hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            
            <span className="bg-orange-100 text-[#8b1818] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider w-fit mb-4 border border-orange-200">
              {product.category || "Pooja Samagri"}
            </span>

            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4 leading-tight">
              {product.title}
            </h1>

            <div className="flex items-end gap-2 mb-6">
              <span className="text-4xl font-extrabold text-[#c21820]">₹{product.price}</span>
              <span className="text-gray-400 font-medium line-through mb-1">₹{Math.round(product.price * 1.4)}</span>
              <span className="text-green-600 font-bold text-sm mb-1 ml-2">(Save 40%)</span>
            </div>

            <div className="w-full h-[1px] bg-gray-100 mb-6"></div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-[#8b1818] mb-4 border-b pb-2">
                Items Included in this Kit:
              </h3>
              
              {itemsIncluded.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                  {itemsIncluded.map((item, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="capitalize">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 leading-relaxed">
                  A complete, hand-picked premium puja kit containing all essential items required to perform the puja.
                </p>
              )}
            </div>

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