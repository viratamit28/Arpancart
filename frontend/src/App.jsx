import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollManager from './components/ScrollManager';
import PageLoader from './components/PageLoader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop'; 
import ProductDetails from './pages/ProductDetails';
import Subscriptions from './pages/Subscriptions';
import TrackOrder from './pages/TrackOrder';
import Privacy from './pages/Privacy';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Auth from './pages/Auth';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
        
        {/* Navbar sabse upar, ye kabhi nahi chhipega */}
        <Navbar />
        
        <ScrollManager />
        
        {/* 'relative' lagana zaroori hai taaki loader iske andar hi rahe */}
        <main className="flex-grow relative flex flex-col">
          
          {/* PageLoader ab main ke andar hai */}
          <PageLoader /> 
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} /> 
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/privacy" element={<Privacy />} /> 
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;