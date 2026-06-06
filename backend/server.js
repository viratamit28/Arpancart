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
// 🛡️ 1. SECURITY MIDDLEWARE
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

const isAdmin = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Access Denied! You are not authorized." });
    }
    next(); 
  } catch (error) {
    res.status(500).json({ success: false, message: "Role verify karne me error aayi." });
  }
};

// ==========================================
// 🛍️ 2. PUBLIC APIs (Products)
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
      { title: "Essential Pooja Samagri Kit (Hawan Set)", description: "A comprehensive set for daily rituals. Includes Haldi-Chandan, Akshat, Supari, Kalava, Kali Sarson, and other essential hawan items.", price: 499.00, category: "Pooja Kits", imageUrl: "https://placehold.co/600x400/ea580c/fff?text=Detailed+Hawan+Samagri", stockQuantity: 20 },
      { title: "Saraswati Pooja Kit", description: "A specially curated kit for performing Saraswati Pooja. Contains Haldi Powder, Kumkum, Akshat, Bambooless Agarbatti, and a Maa Saraswati photo card.", price: 599.00, category: "Pooja Kits", imageUrl: "https://placehold.co/600x400/ea580c/fff?text=Saraswati+Pooja+Materials", stockQuantity: 15 },
      { title: "Complete Satyanarayan Pooja Kit", description: "Everything you need for a traditional Satyanarayan Pooja. Includes Akshat, Ashtagandha, Laung, Chandan Jal, and a Satyanarayan Bhagwan photo.", price: 899.00, category: "Pooja Kits", imageUrl: "https://placehold.co/600x400/ea580c/fff?text=Satyanarayan+Pooja+Set", stockQuantity: 10 },
      { title: "Daily Rituals Starter Kit", description: "A convenient kit for your daily pooja needs. Includes Gangajal, Pooja Aasan, Kalava, Dhoop Cones, and other essential items.", price: 349.00, category: "Pooja Kits", imageUrl: "https://placehold.co/600x400/ea580c/fff?text=Daily+Starter+Kit", stockQuantity: 25 },
      { title: "Hanuman Pooja Kit (Red Theme)", description: "A specialized kit dedicated to Hanuman Pooja. Contains Chameli Tel, Chandi ka vark, Dhoop Batti, and a red langot.", price: 449.00, category: "Pooja Kits", imageUrl: "https://placehold.co/600x400/b91c1c/fff?text=Hanuman+Ji+Pooja+Kit", stockQuantity: 18 },
      { title: "Navratri/Durga Pooja Kit", description: "A comprehensive kit designed for Durga Pooja and Navratri festivals. Includes Pooja Aasan, Ashtagandha, Kamalgatta, and a Maa Durga photo card.", price: 999.00, category: "Pooja Kits", imageUrl: "https://placehold.co/600x400/ea580c/fff?text=Durga+Pooja+Samagri", stockQuantity: 12 },
      { title: "Shani Dev Pooja Kit (Shani Samagri)", description: "A dedicated kit for performing Shani Dev Pooja. Includes Kali Urad, Kapur, til ka tel, and other traditional Shani samagri.", price: 549.00, category: "Pooja Kits", imageUrl: "https://placehold.co/600x400/111/fff?text=Shani+Dev+Samagri", stockQuantity: 16 }
    ];
    await prisma.product.createMany({ data: poodaKitsData });
    res.json({ success: true, message: `Naye Pooja Kits add ho gaye!` });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error seeding new pooja kits", error: error.message });
  }
});

// ==========================================
// 🔐 3. AUTHENTICATION APIs
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

app.post('/api/auth/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });
    
    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Access Denied! Sirf Admin yahan login kar sakte hain." });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, message: "Admin Login successful! 👑", token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Login error", error: error.message });
  }
});

app.get('/api/auth/make-me-admin/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: { role: 'admin' }
    });
    res.json({ success: true, message: `Badhai ho! ${email} ab ADMIN ban chuka hai! 👑` });
  } catch (error) {
    res.status(500).json({ success: false, message: "Account nahi mila ya error aayi", error: error.message });
  }
});

// ==========================================
// 📦 4. ORDER APIs (Protected)
// ==========================================
app.post('/api/orders', verifyToken, async (req, res) => {
  try {
    const { items, totalAmount } = req.body; 

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty." });
    }

    const newOrder = await prisma.order.create({
      data: {
        userId: req.user.userId,
        totalAmount: parseFloat(totalAmount), 
        status: "Processing",
        items: {
          create: items.map(item => {
            const pId = item.product?.id || item.product || item.id || item._id;
            return {
              productId: parseInt(pId), 
              quantity: parseInt(item.quantity || 1),
              price: parseFloat(item.price || item.discountedPrice)
            };
          })
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

app.get('/api/orders/track/:orderId', async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId);
    if (isNaN(orderId)) return res.status(400).json({ success: false, message: "Invalid Order ID format. Please use numbers." });

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } }
    });

    if (!order) return res.status(404).json({ success: false, message: "Order not found. Please verify the ID." });

    res.json({ success: true, data: order });
  } catch (error) {
    console.error("Tracking error:", error);
    res.status(500).json({ success: false, message: "Server error while tracking order." });
  }
});

// ==========================================
// 🏠 5. ADDRESS APIs (Protected)
// ==========================================
app.post('/api/addresses', verifyToken, async (req, res) => {
  try {
    const { fullName, phone, street, city, state, pincode, isDefault } = req.body;
    if (!fullName || !phone || !street || !city || !state || !pincode) {
      return res.status(400).json({ success: false, message: "Please fill all the address fields." });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: req.user.userId, fullName, phone, street, city, state, pincode, isDefault: isDefault || false
      }
    });
    res.status(201).json({ success: true, message: "Address saved successfully!", data: newAddress });
  } catch (error) {
    console.error("Address save error:", error);
    res.status(500).json({ success: false, message: "Failed to save address.", error: error.message });
  }
});

app.get('/api/addresses', verifyToken, async (req, res) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: addresses });
  } catch (error) {
    console.error("Address fetch error:", error);
    res.status(500).json({ success: false, message: "Failed to load addresses." });
  }
});

// ==========================================
// 📧 6. CONTACT API
// ==========================================
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) return res.status(400).json({ success: false, message: "Please fill all fields." });

    const newContact = await prisma.contact.create({ data: { name, email, subject, message } });
    res.status(201).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ success: false, message: "Server error, please try again later.", error: error.message });
  }
});

// ==========================================
// 👑 7. ADMIN ONLY APIs (DASHBOARD)
// ==========================================
app.get('/api/admin/stats', verifyToken, isAdmin, async (req, res) => {
  try {
    const totalOrders = await prisma.order.count();
    const totalProducts = await prisma.product.count();
    const totalUsers = await prisma.user.count({ where: { role: 'customer' } });
    
    // Revenue calculate karne ka optimized tarika (Prisma aggregate se)
    const orderSums = await prisma.order.aggregate({ _sum: { totalAmount: true } });
    const totalRevenue = orderSums._sum.totalAmount || 0;

    res.json({ success: true, data: { totalOrders, totalProducts, totalUsers, totalRevenue } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Stats fetch error", error: error.message });
  }
});

app.get('/api/admin/orders', verifyToken, isAdmin, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { 
        user: { select: { name: true, email: true } },
        items: { include: { product: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Orders fetch error", error: error.message });
  }
});

app.put('/api/admin/orders/:id/status', verifyToken, isAdmin, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body; 

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: status }
    });
    res.json({ success: true, message: `Order status updated to ${status}! ✅`, data: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: "Order status update nahi ho paya", error: error.message });
  }
});

app.post('/api/admin/products', verifyToken, isAdmin, async (req, res) => {
  try {
    const { title, description, price, category, imageUrl, stockQuantity, discountedPrice } = req.body;
    const newProduct = await prisma.product.create({
      data: {
        title, description, price: parseFloat(price), discountedPrice: discountedPrice ? parseFloat(discountedPrice) : null,
        category, imageUrl, stockQuantity: parseInt(stockQuantity || 0)
      }
    });
    res.status(201).json({ success: true, message: "Naya Product successfully add ho gaya! 🛍️", data: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: "Product add karne me error aayi", error: error.message });
  }
});

app.put('/api/admin/products/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const { title, description, price, category, imageUrl, stockQuantity, discountedPrice } = req.body;
    
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        title, description, price: parseFloat(price), discountedPrice: discountedPrice ? parseFloat(discountedPrice) : null,
        category, imageUrl, stockQuantity: parseInt(stockQuantity || 0)
      }
    });
    res.json({ success: true, message: "Product successfully update ho gaya! ✏️", data: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: "Product update nahi ho paya", error: error.message });
  }
});

app.delete('/api/admin/products/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ success: false, message: "Product nahi mila" });

    await prisma.product.delete({ where: { id: productId } });
    res.json({ success: true, message: "Product delete ho gaya! 🗑️" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Product delete karne me error aayi (Shayad iska order place ho chuka hai)", error: error.message });
  }
});

app.get('/api/admin/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Customers fetch karne me error aayi", error: error.message });
  }
});

// ==========================================
// 🚀 8. SERVER START (Yeh hamesha End mein hona chahiye!)
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`⚙️ Server running on port ${PORT}`);
});