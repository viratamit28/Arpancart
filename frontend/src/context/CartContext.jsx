import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  
  // 🚨 NAYI STATE: Navbar me Tooltip dikhane ke liye
  const [showCartIndicator, setShowCartIndicator] = useState(false);

  // Product add karne ke liye
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Backend se '_id' bhi aa sakta hai MongoDB wale format me, isliye dono check kiye hain
      const productId = product.id || product._id;
      const existingItem = prevItems.find(item => (item.id || item._id) === productId);
      
      if (existingItem) {
        return prevItems.map(item =>
          (item.id || item._id) === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, id: productId, quantity: 1 }];
    });

    // 🚨 TOOLTIP LOGIC: Jaise hi item add hoga, indicator ON hoga aur 3 sec baad OFF
    setShowCartIndicator(true);
    setTimeout(() => {
      setShowCartIndicator(false);
    }, 3000);
  };

  // ✅ NAYA FUNCTION: Cart khali karne ke liye (Checkout ke baad)
  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    // value me sabkuch pass kar diya, setCartItems bhi (taaki baaki components use kar sakein)
    <CartContext.Provider value={{ 
      cartItems, 
      setCartItems, 
      addToCart, 
      clearCart, 
      cartCount, 
      showCartIndicator 
    }}>
      {children}
    </CartContext.Provider>
  );
};