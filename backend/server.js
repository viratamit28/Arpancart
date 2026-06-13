const express = require('express');
const cors = require('cors');
// Prisma import kiya taaki public-settings kaam kar sake
const prisma = require('./config/db'); 
require('dotenv').config();

// 🚨 NAYA: Cron Job file ko yahan import kiya hai taaki server start hote hi daily tracker chalu ho jaye
require('./cronJobs'); 

const app = express();

// Middlewares
// CORS ko thoda explicit kar diya taaki production me block na ho
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

// Routes Import
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
// 🚨 NAYA: Subscription routes ko import kiya
const subscriptionRoutes = require('./routes/subscriptionRoutes');

// ==========================================
// ⚙️ PUBLIC SETTINGS API (Missing tha, ab add ho gaya)
// ==========================================
app.get('/api/public-settings', async (req, res) => {
  try {
    let settings = await prisma.siteSetting.findFirst();
    if (!settings) {
      // Default fallback agar DB empty ho
      settings = await prisma.siteSetting.create({ 
        data: { whatsappNumber: "910000000000", facebookUrl: "", instagramUrl: "" } 
      });
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Settings fetch error" });
  }
});

// API Endpoints Setup
app.use('/api/auth', authRoutes);
app.use('/api', productRoutes);     // Contains /products and /contact
app.use('/api', orderRoutes);       // Contains /orders and /addresses
app.use('/api/admin', adminRoutes); // Contains all admin endpoints and /settings
// 🚨 NAYA: Subscription API endpoint attach kiya
app.use('/api/subscriptions', subscriptionRoutes);

// Error Handling Route
app.use((req, res) => {
  res.status(404).json({ success: false, message: "API Route Not Found!" });
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running cleanly on port ${PORT}`);
});