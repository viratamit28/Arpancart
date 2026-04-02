import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { CartProvider } from './context/CartContext.jsx' // 1. Import karo

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. App ko CartProvider ke andar wrap kar do */}
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>,
)