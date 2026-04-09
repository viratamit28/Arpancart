import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  
  // State for showing the navbar tooltip indicator
  const [showCartIndicator, setShowCartIndicator] = useState(false);

  // Function to add a product to the cart
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Check for both 'id' and '_id' to support different backend formats (like MongoDB)
      const productId = product.id || product._id;
      const existingItem = prevItems.find(item => (item.id || item._id) === productId);
      
      if (existingItem) {
        // Increase quantity if item already exists
        return prevItems.map(item =>
          (item.id || item._id) === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Add new item with quantity 1
      return [...prevItems, { ...product, id: productId, quantity: 1 }];
    });

    // Show indicator tooltip for 3 seconds
    setShowCartIndicator(true);
    setTimeout(() => {
      setShowCartIndicator(false);
    }, 3000);
  };

  // Function to handle + and - quantity buttons on the Cart page
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id); // Remove item completely if quantity drops below 1
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