import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // ✅ FIX 1: Jab page load ho, toh pehle LocalStorage se purana data dhoondho
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('arpanCartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error reading cart from local storage", error);
      return [];
    }
  });
  
  const [showCartIndicator, setShowCartIndicator] = useState(false);

  // ✅ FIX 2: Jab bhi cartItems update ho, usko turant LocalStorage mein save kar do
  useEffect(() => {
    localStorage.setItem('arpanCartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Function to add a product to the cart
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const productId = product.id || product._id;
      const existingItem = prevItems.find(item => (item.id || item._id) === productId);
      
      if (existingItem) {
        return prevItems.map(item =>
          (item.id || item._id) === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, id: productId, quantity: 1 }];
    });

    setShowCartIndicator(true);
    setTimeout(() => {
      setShowCartIndicator(false);
    }, 3000);
  };

  // Function to handle + and - quantity buttons on the Cart page
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id); 
      return;
    }
    setCartItems(
      cartItems.map((item) =>
        (item.id || item._id) === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Function to handle the Delete/Trash button on the Cart page
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => (item.id || item._id) !== id));
  };

  // Function to empty the entire cart (used after successful checkout)
  const clearCart = () => {
    setCartItems([]);
    // Jab checkout ho jaye, toh local storage bhi saaf kar do
    localStorage.removeItem('arpanCartItems');
  };

  // Calculate total number of items for the navbar badge
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      setCartItems, 
      addToCart, 
      updateQuantity, 
      removeFromCart, 
      clearCart, 
      cartCount, 
      showCartIndicator 
    }}>
      {children}
    </CartContext.Provider>
  );
};