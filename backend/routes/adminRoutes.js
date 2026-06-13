const express = require('express');
const prisma = require('../config/db');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

// ==========================================
// 📊 DASHBOARD STATS
// ==========================================
router.get('/stats', verifyToken, isAdmin, async (req, res) => {
  try {
    const totalOrders = await prisma.order.count();
    const totalProducts = await prisma.product.count();
    const totalUsers = await prisma.user.count({ where: { role: 'customer' } });
    const orderSums = await prisma.order.aggregate({ _sum: { totalAmount: true } });
    res.json({ success: true, data: { totalOrders, totalProducts, totalUsers, totalRevenue: orderSums._sum.totalAmount || 0 } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Stats fetch error" });
  }
});

// ==========================================
// 🧑‍🤝‍🧑 USERS MANAGEMENT (🚨 MISSING THA, AB ADD KIYA)
// ==========================================
router.get('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: users });
  } catch (error) {
    console.error("Fetch Users Error:", error);
    res.status(500).json({ success: false, message: "Users data laane mein error aayi" });
  }
});

// ==========================================
// 📦 ORDERS MANAGEMENT (🚨 MISSING THA, AB ADD KIYA)
// ==========================================
router.get('/orders', verifyToken, isAdmin, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { 
        user: true,   // Customer ka naam/email lane ke liye
        items: true   // Order ke items lane ke liye
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    res.status(500).json({ success: false, message: "Orders data laane mein error aayi" });
  }
});

// Order Status Update API
router.put('/orders/:id/status', verifyToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = parseInt(req.params.id);

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: status.toUpperCase() } // Prisma Schema enum (PENDING, DELIVERED etc) se match karne ke liye
    });

    res.json({ success: true, message: `Order status updated to ${status}`, data: updatedOrder });
  } catch (error) {
    console.error("Order Status Update Error:", error);
    res.status(500).json({ success: false, message: "Order status update fail ho gaya" });
  }
});


// ==========================================
// 🗂️ CATEGORY & SUB-CATEGORY MANAGEMENT 
// ==========================================

// 1. Get all Categories (with their SubCategories)
router.get('/categories', verifyToken, isAdmin, async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { subCategories: true } // Ek sath uske andar ki sub-categories bhi aa jayengi
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Categories fetch error", error: error.message });
  }
});

// 2. Add a new Category
router.post('/categories', verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, imageUrl, isActive } = req.body;
    const newCategory = await prisma.category.create({
      data: { 
        name, 
        imageUrl, 
        isActive: isActive !== undefined ? isActive : true 
      }
    });
    res.status(201).json({ success: true, message: "Category added successfully!", data: newCategory });
  } catch (error) {
    if (error.code === 'P2002') return res.status(400).json({ success: false, message: "Category name already exists!" });
    res.status(500).json({ success: false, message: "Category add error", error: error.message });
  }
});

// 3. Add a new Sub-Category
router.post('/subcategories', verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    const newSubCategory = await prisma.subCategory.create({
      data: { 
        name, 
        categoryId: parseInt(categoryId) 
      }
    });
    res.status(201).json({ success: true, message: "Sub-Category added successfully!", data: newSubCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: "Sub-Category add error", error: error.message });
  }
});

// ==========================================
// 🛍️ PRODUCTS MANAGEMENT 
// ==========================================
// Product Add API
router.post('/products', verifyToken, isAdmin, async (req, res) => {
  try {
    const { title, description, price, category, categoryId, subCategoryId, imageUrl, stockQuantity, discountedPrice, deliveryCharge } = req.body;
    
    const newProduct = await prisma.product.create({
      data: { 
        title, 
        description, 
        price: parseFloat(price), 
        discountedPrice: discountedPrice ? parseFloat(discountedPrice) : null, 
        categoryString: category, 
        categoryId: categoryId ? parseInt(categoryId) : null,      
        subCategoryId: subCategoryId ? parseInt(subCategoryId) : null, 
        imageUrl, 
        stockQuantity: parseInt(stockQuantity || 0),
        deliveryCharge: parseFloat(deliveryCharge || 0)
      }
    });
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: "Product add error", error: error.message });
  }
});

// Product Update API
router.put('/products/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { title, description, price, category, categoryId, subCategoryId, imageUrl, stockQuantity, discountedPrice, deliveryCharge } = req.body;
    
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: { 
        title, 
        description, 
        price: parseFloat(price), 
        discountedPrice: discountedPrice ? parseFloat(discountedPrice) : null, 
        categoryString: category, 
        categoryId: categoryId ? parseInt(categoryId) : null,      
        subCategoryId: subCategoryId ? parseInt(subCategoryId) : null, 
        imageUrl, 
        stockQuantity: parseInt(stockQuantity || 0),
        deliveryCharge: parseFloat(deliveryCharge || 0)
      }
    });
    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: "Update error", error: error.message });
  }
});

// Product Delete API
router.delete('/products/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    await prisma.product.delete({
      where: { id: productId }
    });

    res.json({ success: true, message: "Product Deleted Successfully! 🗑️" });
  } catch (error) {
    if (error.code === 'P2003') {
      return res.status(400).json({ 
        success: false, 
        message: "Yeh product kisi active order mein shamil hai, isliye isko delete nahi kar sakte!" 
      });
    }
    
    res.status(500).json({ success: false, message: "Product delete karne mein error aayi", error: error.message });
  }
});

// ==========================================
// ⚙️ SITE SETTINGS (Admin & Public)
// ==========================================
// Update Site Settings (Admin Panel ke liye)
router.put('/settings', verifyToken, isAdmin, async (req, res) => {
  try {
    const { whatsappNumber, facebookUrl, instagramUrl, trendingBannerUrl, trendingTitle } = req.body;
    
    const existing = await prisma.siteSetting.findFirst();
    let updated;
    
    if (existing) {
      updated = await prisma.siteSetting.update({ 
        where: { id: existing.id }, 
        data: { whatsappNumber, facebookUrl, instagramUrl, trendingBannerUrl, trendingTitle } 
      });
    } else {
      updated = await prisma.siteSetting.create({ 
        data: { whatsappNumber, facebookUrl, instagramUrl, trendingBannerUrl, trendingTitle } 
      });
    }
    res.json({ success: true, message: "Settings Updated!", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Settings update fail", error: error.message });
  }
});

// ==========================================
// 🌅 CAROUSEL MANAGEMENT (Admin APIs)
// ==========================================
router.get('/carousel', verifyToken, isAdmin, async (req, res) => {
  try {
    let carousels = await prisma.dayCarousel.findMany({
      orderBy: { id: 'asc' } 
    });
    
    if (carousels.length === 0) {
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      const defaultData = days.map(day => ({
        dayOfWeek: day,
        imageUrl: `https://placehold.co/1200x400/f7941d/fff?text=${day}+Darshan`,
        isActive: true
      }));
      
      await prisma.dayCarousel.createMany({ data: defaultData });
      carousels = await prisma.dayCarousel.findMany({ orderBy: { id: 'asc' } });
    }

    res.json({ success: true, data: carousels });
  } catch (error) {
    res.status(500).json({ success: false, message: "Carousel fetch fail" });
  }
});

router.put('/carousel/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { imageUrl, isActive } = req.body;
    const updated = await prisma.dayCarousel.update({
      where: { id: parseInt(req.params.id) },
      data: { imageUrl, isActive }
    });
    res.json({ success: true, message: "Image update ho gayi!", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Update fail", error: error.message });
  }
});

// ==========================================
// 🎟️ COUPON MANAGEMENT (Admin APIs)
// ==========================================
router.get('/coupons', verifyToken, isAdmin, async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: "Coupons fetch error" });
  }
});

router.post('/coupons', verifyToken, isAdmin, async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderValue, expiryDate } = req.body;
    const newCoupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(), 
        discountType, 
        discountValue: parseFloat(discountValue),
        minOrderValue: parseFloat(minOrderValue || 0),
        expiryDate: new Date(expiryDate),
        isActive: true
      }
    });
    res.status(201).json({ success: true, message: "Coupon successfully added! 🎟️", data: newCoupon });
  } catch (error) {
    if (error.code === 'P2002') return res.status(400).json({ success: false, message: "Yeh Coupon Code already exists hai!" });
    res.status(500).json({ success: false, message: "Coupon add karne me error aayi" });
  }
});

router.delete('/coupons/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await prisma.coupon.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, message: "Coupon deleted successfully! 🗑️" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Coupon delete error" });
  }
});

module.exports = router;