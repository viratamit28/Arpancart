import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart } = useContext(CartContext);

  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#fcfaf5] flex flex-col items-center justify-center px-6">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-orange-50 flex flex-col items-center text-center max-w-md w-full">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-[#f7941d]" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#8b1818] mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 font-medium mb-8">
            Looks like you haven't added any pooja samagri to your cart yet.
          </p>
          <Link 
            to="/shop" 
            className="w-full bg-[#f7941d] hover:bg-[#e0861a] text-white font-bold py-3.5 px-8 rounded shadow-md transition-all hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            Start Shopping <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-6 md:px-12 bg-[#fcfaf5] min-h-[80vh]">
      <div className="max-w-7xl mx-auto">
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#8b1818] mb-10 tracking-wide">
          Shopping Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* LEFT SIDE: CART ITEMS LIST */}
          <div className="lg:w-2/3 space-y-6">
            {cartItems.map((item, index) => (
              <div 
                key={index} 
                className="flex flex-col sm:flex-row items-center gap-6 bg-white p-4 md:p-6 rounded-xl shadow-sm border border-orange-50 relative group"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-orange-50 flex-shrink-0">
                  <img src={item.imageUrl || item.imageurl} alt={item.title} className="w-full h-full object-cover" />
                </div>

                <div className="flex-grow text-center sm:text-left w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1">{item.title}</h3>
                      <p className="text-sm font-bold text-[#8b1818] bg-orange-50 px-3 py-1 rounded-full w-fit mx-auto sm:mx-0 mb-3">
                        ₹{item.price} each
                      </p>
                    </div>
                    {/* Delete Button */}
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="hidden sm:block p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center justify-center sm:justify-start gap-4 mt-2">
                    <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-gray-50">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-2 text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-1.5 font-bold text-[#8b1818] bg-white border-x border-gray-200">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-2 text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="sm:hidden p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="sm:text-right w-full sm:w-auto mt-4 sm:mt-0 border-t sm:border-none pt-4 sm:pt-0 flex justify-between sm:block items-center">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total</p>
                  <p className="text-2xl font-extrabold text-gray-900">₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE: ORDER SUMMARY */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-orange-50 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-4 mb-6">
                Order Summary
              </h2>
              
              <div className="space-y-4 text-gray-600 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Subtotal ({cartItems.length} items)</span>
                  <span className="font-bold text-gray-800">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Shipping Fee</span>
                  <span className="font-bold text-green-600">Free</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 mb-8 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-800">Total Amount</span>
                <span className="text-3xl font-extrabold text-[#c21820]">₹{totalAmount}</span>
              </div>

              <Link 
                to="/checkout" 
                className="w-full block text-center bg-[#8b1818] hover:bg-[#6e1313] text-white font-bold text-lg py-4 px-6 rounded shadow-md transition-all hover:shadow-lg active:scale-95"
              >
                Proceed to Checkout
              </Link>
              
              <div className="mt-4 text-center">
                <Link to="/shop" className="text-sm font-bold text-[#f7941d] hover:text-[#e0861a] transition-colors">
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;