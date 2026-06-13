const express = require('express');
const prisma = require('../config/db');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();

// ==========================================
// 🎟️ APPLY COUPON (Public API)
// ==========================================
router.post('/apply-coupon', async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    
    // Database se coupon dhoondho
    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
    
    // 1. Validation Checks
    if (!coupon) return res.status(400).json({ success: false, message: "Invalid Coupon Code!" });
    if (!coupon.isActive) return res.status(400).json({ success: false, message: "This coupon is no longer active." });
    if (new Date() > new Date(coupon.expiryDate)) return res.status(400).json({ success: false, message: "This coupon has expired." });
    if (cartTotal < coupon.minOrderValue) return res.status(400).json({ success: false, message: `Minimum order value for this coupon is ₹${coupon.minOrderValue}` });

    // 2. Discount Calculation
    let discountAmount = 0;
    if (coupon.discountType === 'FIXED') {
      discountAmount = coupon.discountValue;
    } else if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
    }

    // Taki discount total bill se zyada na ho jaye
    if (discountAmount > cartTotal) discountAmount = cartTotal;

    res.json({ 
      success: true, 
      message: "Coupon Applied Successfully! 🎉", 
      data: {
        discountAmount,
        finalTotal: cartTotal - discountAmount,
        couponCode: coupon.code
      }
    });

  } catch (error) {
    console.error("Coupon Error:", error);
    res.status(500).json({ success: false, message: "Coupon apply karne me error aayi" });
  }
});

// ==========================================
// 🛒 ORDER ROUTES (Protected)
// ==========================================
router.post('/orders', verifyToken, async (req, res) => {
  try {
    // 🚨 FIX: Payment aur coupon data bhi nikal liya
    const { items, totalAmount, shippingAddress, paymentMethod, discount, couponApplied } = req.body; 

    const newOrder = await prisma.order.create({
      data: {
        userId: req.user.userId,
        totalAmount: parseFloat(totalAmount), 
        shippingAddress: shippingAddress, 
        status: "PENDING",
        // 👇 Future proofing: Agar coupon ya online payment ho toh DB me save hoga
        paymentMethod: paymentMethod || "COD", 
        discount: discount ? parseFloat(discount) : 0,
        couponApplied: couponApplied || null,
        items: {
          create: items.map(item => ({
            productId: parseInt(item.productId), 
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price)
          }))
        }
      },
      include: { items: true }
    });
    
    res.status(201).json({ success: true, message: "Order placed!", orderId: newOrder.id });
  } catch (error) {
    console.error("🔥 POST /orders Error:", error);
    res.status(500).json({ success: false, message: "Order place nahi ho paya" });
  }
});

router.get('/orders/my-orders', verifyToken, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({ 
      where: { userId: req.user.userId }, 
      include: { items: { include: { product: true } } }, 
      orderBy: { createdAt: 'desc' } 
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("🔥 GET /my-orders Error:", error);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
});

// ==========================================
// 📍 ADDRESS ROUTES (Protected)
// ==========================================
router.post('/addresses', verifyToken, async (req, res) => {
  try {
    const { fullName, phone, street, city, state, pincode, isDefault } = req.body;
    const newAddress = await prisma.address.create({
      data: { userId: req.user.userId, fullName, phone, street, city, state, pincode, isDefault: isDefault || false }
    });
    res.status(201).json({ success: true, data: newAddress });
  } catch (error) {
    console.error("🔥 POST /addresses Error:", error);
    res.status(500).json({ success: false, message: "Address save error" });
  }
});

router.get('/addresses', verifyToken, async (req, res) => {
  try {
    const addresses = await prisma.address.findMany({ where: { userId: req.user.userId } });
    res.json({ success: true, data: addresses });
  } catch (error) {
    console.error("🔥 GET /addresses Error:", error);
    res.status(500).json({ success: false, message: "Address fetch error" });
  }
});

// ==========================================
// 🚚 TRACK ORDER ROUTE (Public/Protected)
// ==========================================
router.get('/orders/track/:id', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);

    // 🚨 SMART FIX: Agar id number nahi hai toh server crash hone se bachao
    if (isNaN(orderId)) {
      return res.status(400).json({ success: false, message: "Invalid Order ID format." });
    }

    // Prisma query order find karne ke liye
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true } 
        }
      }
    });

    // Agar order nahi mila
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found. Please check your Order ID." });
    }

    // Agar mil gaya toh data bhej do
    return res.status(200).json({ success: true, data: order });
    
  } catch (error) {
    console.error("🔥 Error tracking order:", error);
    return res.status(500).json({ success: false, message: "Server error while tracking order." });
  }
});

module.exports = router;