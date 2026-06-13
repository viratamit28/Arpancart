const express = require('express');
const prisma = require('../config/db');
const router = express.Router();

// ==========================================
// 🛍️ PRODUCTS & CONTACT APIs
// ==========================================
router.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany(); 
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Products lane me error aayi" });
  }
});

router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    await prisma.contact.create({ data: { name, email, subject, message } });
    res.status(201).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Contact form error" });
  }
});

// ==========================================
// 🗂️ CATEGORIES (🚨 NAYA: Public API - Homepage ke liye)
// ==========================================
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { subCategories: true } // Sub-categories (Kits) bhi sath aayengi
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Categories fetch karne me error aayi" });
  }
});

// ==========================================
// 🌅 7-DAY GOD CAROUSEL (Public API - Homepage ke liye)
// ==========================================
router.get('/carousel/today', async (req, res) => {
  try {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayName = days[new Date().getDay()];

    const todayCarousel = await prisma.dayCarousel.findFirst({
      where: { dayOfWeek: todayName, isActive: true }
    });

    res.json({ success: true, today: todayName, data: todayCarousel });
  } catch (error) {
    res.status(500).json({ success: false, message: "Carousel fetch karne me error aayi" });
  }
});

// ==========================================
// ⚙️ GET PUBLIC SETTINGS (Navbar & Footer ke liye)
// ==========================================
router.get('/public-settings', async (req, res) => {
  try {
    let settings = await prisma.siteSetting.findFirst();
    
    if (!settings) {
      settings = { whatsappNumber: "9123187724", facebookUrl: "", instagramUrl: "" };
    }
    
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Settings fetch error" });
  }
});

// ⚠️ NOTE: Admin Carousel update/create wali APIs (PUT /admin/carousel/:id) 
// yahan se hata kar 'adminRoute.js' mein daal dena chahiye taaki usme 
// 'verifyToken' aur 'isAdmin' security lag sake aur website hack na ho.

module.exports = router;