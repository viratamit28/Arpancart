const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');        
const jwt = require('jsonwebtoken');       
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ==========================================
// 🛍️ 1. PRODUCT APIs
// ==========================================
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany(); 
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Products lane me error aayi", error: error.message });
  }
});

app.get('/api/seed-products', async (req, res) => {
  try {
    const poodaKitsData = [
      {
        title: "Essential Pooja Samagri Kit (Hawan Set)",
        description: "A comprehensive set for daily rituals. Includes Haldi-Chandan, Akshat, Supari, Kalava, Kali Sarson, and other essential hawan items.",
        price: 499.00,
        category: "Pooja Kits",
        imageUrl: "https://placehold.co/600x400/ea580c/fff?text=Detailed+Hawan+Samagri", 
        stockQuantity: 20
      },
      {
        title: "Saraswati Pooja Kit",
        description: "A specially curated kit for performing Saraswati Pooja. Contains Haldi Powder, Kumkum, Akshat, Bambooless Agarbatti, and a Maa Saraswati photo card.",
        price: 599.00,
        category: "Pooja Kits",
        imageUrl: "https://placehold.co/600x400/ea580c/fff?text=Saraswati+Pooja+Materials", 
        stockQuantity: 15
      },
      {
        title: "Complete Satyanarayan Pooja Kit",
        description: "Everything you need for a traditional Satyanarayan Pooja. Includes Akshat, Ashtagandha, Laung, Chandan Jal, and a Satyanarayan Bhagwan photo.",
        price: 899.00,
        category: "Pooja Kits",
        imageUrl: "https://placehold.co/600x400/ea580c/fff?text=Satyanarayan+Pooja+Set", 
        stockQuantity: 10
      },
      {
        title: "Daily Rituals Starter Kit",
        description: "A convenient kit for your daily pooja needs. Includes Gangajal, Pooja Aasan, Kalava, Dhoop Cones, and other essential items.",
        price: 349.00,
        category: "Pooja Kits",
        imageUrl: "https://placehold.co/600x400/ea580c/fff?text=Daily+Starter+Kit", 
        stockQuantity: 25
      },
      {
        title: "Hanuman Pooja Kit (Red Theme)",
        description: "A specialized kit dedicated to Hanuman Pooja. Contains Chameli Tel, Chandi ka vark, Dhoop Batti, and a red langot.",
        price: 449.00,
        category: "Pooja Kits",
        imageUrl: "https://placehold.co/600x400/b91c1c/fff?text=Hanuman+Ji+Pooja+Kit", 
        stockQuantity: 18
      },
      {
        title: "Navratri/Durga Pooja Kit",
        description: "A comprehensive kit designed for Durga Pooja and Navratri festivals. Includes Pooja Aasan, Ashtagandha, Kamalgatta, and a Maa Durga photo card.",
        price: 999.00,
        category: "Pooja Kits",
        imageUrl: "https://placehold.co/600x400/ea580c/fff?text=Durga+Pooja+Samagri", 
        stockQuantity: 12
      },
      {
        title: "Shani Dev Pooja Kit (Shani Samagri)",
        description: "A dedicated kit for performing Shani Dev Pooja. Includes Kali Urad, Kapur, til ka tel, and other traditional Shani samagri.",
        price: 549.00,
        category: "Pooja Kits",
        imageUrl: "https://placehold.co/600x400/111/fff?text=Shani+Dev+Samagri", 
        stockQuantity: 16
      }
    ];
    await prisma.product.createMany({ data: poodaKitsData });
    res.json({ success: true, message: `Naye Pooja Kits add ho gaye!` });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error seeding new pooja kits", error: error.message });
  }
});

// ==========================================
// 🔐 2. AUTHENTICATION APIs
// ==========================================
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ success: false, message: "Email already registered!" });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await prisma.user.create({ data: { name, email, password: hashedPassword } });
    
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ success: true, message: "Account created!", token, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Signup error", error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, message: "Login successful! 🎉", token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Login error", error: error.message });
  }
});

// ==========================================
// 🛡️ 3. SECURITY MIDDLEWARE
// ==========================================
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ success: false, message: "Access Denied! Token nahi mila." });
  try {
    const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = verified; 
    next(); 
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid Token!" });
  }
};

// ==========================================
// 📦 4. ORDER APIs (Yeh missing tha!)
// ==========================================
app.post('/api/orders', verifyToken, async (req, res) => {
  try {
    const { items, totalAmount } = req.body; 
    const newOrder = await prisma.order.create({
      data: {
        userId: req.user.userId,
        totalAmount: totalAmount,
        status: "Processing",
        items: {
          create: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: { items: true }
    });
    res.status(201).json({ success: true, message: "Order successfully place ho gaya! 🎉", orderId: newOrder.id });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ success: false, message: "Order place nahi ho paya", error: error.message });
  }
});

app.get('/api/orders/my-orders', verifyToken, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Order history nahi mil payi" });
  }
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`⚙️ Server running on port ${PORT}`);
});