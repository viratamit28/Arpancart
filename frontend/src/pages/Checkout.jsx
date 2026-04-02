import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { MapPin, Phone, User as UserIcon, Mail, Building, Hash, CreditCard, ShieldCheck, Loader2 } from 'lucide-react';
import axios from 'axios';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, setCartItems } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [pinLoading, setPinLoading] = useState(false); // PIN code search ka loading state
  const [saveAddress, setSaveAddress] = useState(true); // Checkbox state

  // Form State
  const [shippingData, setShippingData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // =========================================
  // FEATURE 1: AUTO-LOAD SAVED ADDRESS
  // =========================================
  useEffect(() => {
    const savedAddress = localStorage.getItem('arpancart_saved_address');
    if (savedAddress) {
      setShippingData(JSON.parse(savedAddress));
    }
  }, []);

  // Agar cart khali hai
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#fcfaf5] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty!</h2>
        <Link to="/shop" className="bg-[#f7941d] hover:bg-[#e0861a] text-white px-8 py-3 rounded shadow-md font-bold transition-colors">
          Go to Shop
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  // =========================================
  // FEATURE 2: PIN CODE AUTO-DETECT CITY/STATE
  // =========================================
  const handlePinChange = async (e) => {
    const pin = e.target.value;
    // Only allow numbers and max 6 digits
    if (pin.length <= 6 && /^[0-9]*$/.test(pin)) {
      setShippingData({ ...shippingData, zipCode: pin });
      
      // Jaise hi 6 digit poore honge, API call maaro
      if (pin.length === 6) {
        setPinLoading(true);
        try {
          const response = await axios.get(`https://api.postalpincode.in/pincode/${pin}`);
          const data = response.data[0];
          
          if (data.Status === "Success") {
            const postOffice = data.PostOffice[0];
            setShippingData(prev => ({
              ...prev,
              city: postOffice.District,
              state: postOffice.State
            }));
          }
        } catch (error) {
          console.error("PIN Code fetch error:", error);
        } finally {
          setPinLoading(false);
        }
      }
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to place an order.");
      navigate('/login');
      setLoading(false);
      return;
    }

    try {
      const orderPayload = {
        items: cartItems.map(item => ({ product: item.id, quantity: item.quantity, price: item.price })),
        totalAmount,
        shippingAddress: shippingData
      };

      const response = await axios.post('http://localhost:5000/api/orders', orderPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        // FEATURE 1 (Part B): Agar user ne checkbox tick kiya hai, toh address save karlo
        if (saveAddress) {
          localStorage.setItem('arpancart_saved_address', JSON.stringify(shippingData));
        } else {
          localStorage.removeItem('arpancart_saved_address');
        }

        alert("🎉 Order Placed Successfully! Jai Shree Ram!");
        if (setCartItems) setCartItems([]); 
        navigate('/dashboard'); 
      }
    } catch (error) {
      console.error("Order failed:", error);
      alert("Something went wrong while placing the order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fcfaf5] min-h-screen py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#8b1818] mb-2 tracking-wide">
            Secure Checkout
          </h1>
          <p className="text-gray-500 font-medium flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-600" /> 100% Safe and Secure Payments
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* =========================================
              LEFT SIDE: SHIPPING FORM
          ========================================= */}
          <div className="lg:w-2/3">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-orange-50 relative">
              <h2 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-4 mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-[#f7941d]" /> Shipping Details
              </h2>

              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-5">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><UserIcon className="h-5 w-5 text-gray-400" /></div>
                    <input type="text" name="fullName" placeholder="Full Name" required value={shippingData.fullName} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] bg-gray-50 focus:bg-white transition-all" />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div>
                    <input type="email" name="email" placeholder="Email Address" required value={shippingData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] bg-gray-50 focus:bg-white transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className="h-5 w-5 text-gray-400" /></div>
                    <input type="tel" name="phone" placeholder="Phone Number" required value={shippingData.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] bg-gray-50 focus:bg-white transition-all" />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Building className="h-5 w-5 text-gray-400" /></div>
                    <input type="text" name="address" placeholder="House No., Street Name, Landmark" required value={shippingData.address} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] bg-gray-50 focus:bg-white transition-all" />
                  </div>
                </div>

                {/* PIN Code & Auto City/State Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Hash className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      name="zipCode" 
                      placeholder="6-Digit PIN Code" 
                      maxLength="6"
                      required 
                      value={shippingData.zipCode} 
                      onChange={handlePinChange} 
                      className={`w-full pl-10 pr-10 py-3 border rounded-md outline-none transition-all focus:bg-white ${shippingData.zipCode.length === 6 ? 'border-green-400 focus:border-green-500 ring-green-500 bg-green-50' : 'border-gray-200 focus:border-[#f7941d] focus:ring-[#f7941d] bg-gray-50'}`} 
                    />
                    {pinLoading && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Loader2 className="h-5 w-5 text-[#f7941d] animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* City aur State ab readOnly hain kyunki API laa rahi hai, par manual enter bhi kar sakte hain agar API fail ho */}
                  <input type="text" name="city" placeholder="City / District" required value={shippingData.city} onChange={handleChange} className={`w-full px-4 py-3 border rounded-md outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] transition-all ${shippingData.city ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-gray-50 border-gray-200'}`} />
                  <input type="text" name="state" placeholder="State" required value={shippingData.state} onChange={handleChange} className={`w-full px-4 py-3 border rounded-md outline-none focus:border-[#f7941d] focus:ring-1 focus:ring-[#f7941d] transition-all ${shippingData.state ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-gray-50 border-gray-200'}`} />
                </div>

                {/* Save Address Checkbox */}
                <div className="flex items-center mt-4">
                  <input 
                    type="checkbox" 
                    id="saveAddress" 
                    checked={saveAddress} 
                    onChange={(e) => setSaveAddress(e.target.checked)}
                    className="w-4 h-4 text-[#f7941d] border-gray-300 rounded focus:ring-[#f7941d] cursor-pointer" 
                  />
                  <label htmlFor="saveAddress" className="ml-2 block text-sm font-medium text-gray-700 cursor-pointer">
                    Save this address for future orders
                  </label>
                </div>

                {/* Payment Method */}
                <div className="pt-6 border-t border-gray-100 mt-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#8b1818]" /> Payment Method
                  </h3>
                  <div className="flex items-center p-4 border-2 border-[#8b1818] rounded-md bg-red-50 cursor-pointer">
                    <input type="radio" id="cod" name="payment" defaultChecked className="w-4 h-4 text-[#8b1818] focus:ring-[#8b1818]" />
                    <label htmlFor="cod" className="ml-3 font-bold text-[#8b1818] cursor-pointer w-full">Cash on Delivery (COD)</label>
                  </div>
                </div>

              </form>
            </div>
          </div>

          {/* =========================================
              RIGHT SIDE: ORDER SUMMARY
          ========================================= */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-orange-50 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-4 mb-6">
                Your Order
              </h2>

              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#fcfaf5] rounded border border-orange-50 overflow-hidden flex-shrink-0">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-gray-500 font-medium mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#8b1818]">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 text-gray-600 mb-6 border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold text-gray-800">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Shipping</span>
                  <span className="font-bold text-green-600">Free</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 mb-8 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-800">Total</span>
                <span className="text-3xl font-extrabold text-[#c21820]">₹{totalAmount}</span>
              </div>

              <button 
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#f7941d] hover:bg-[#e0861a] text-white font-bold text-lg py-4 px-6 rounded shadow-md transition-all duration-300 hover:shadow-lg active:scale-95 disabled:opacity-70"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                ) : (
                  'Place Order'
                )}
              </button>
              
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;