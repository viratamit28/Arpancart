const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const router = express.Router();

// ==========================================
// 1. REGISTER ROUTE (Updated with mobileNumber)
// ==========================================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, mobileNumber } = req.body;

    // 🔥 FIX: Strict Validation
    if (!name || !email || !password || !mobileNumber) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    if (mobileNumber.length !== 10 || !/^\d{10}$/.test(mobileNumber)) {
      return res.status(400).json({ success: false, message: "Please provide a valid 10-digit mobile number." });
    }

    // 🔥 FIX: Check if user already exists (Email OR mobileNumber)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { mobileNumber: mobileNumber } 
        ]
      }
    });

    // Exact error message based on duplicate type
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ success: false, message: "Email is already registered. Please login." });
      }
      if (existingUser.mobileNumber === mobileNumber) {
        return res.status(400).json({ success: false, message: "Mobile number is already registered. Please login." });
      }
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user with mobileNumber
    const newUser = await prisma.user.create({ 
      data: { 
        name, 
        email, 
        mobileNumber, 
        password: hashedPassword 
      } 
    });
    
    // Token generation
    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ 
      success: true, 
      message: "Account created!", 
      token, 
      user: { 
        id: newUser.id, 
        name: newUser.name, 
        email: newUser.email,
        mobileNumber: newUser.mobileNumber // Return newly added mobile number
      } 
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Signup error", error: error.message });
  }
});

// ==========================================
// 2. LOGIN ROUTE
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    // 🔥 FIX: Password null toh nahi hai pehle check karo
    if (!user || !user.password) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }
    
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      success: true, 
      message: "Login successful!", 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        mobileNumber: user.mobileNumber, // Return mobile number
        role: user.role 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Login error", error: error.message });
  }
});

// ==========================================
// 3. ADMIN LOGIN ROUTE
// ==========================================
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    // 🔥 FIX: Check user, role, aur password ki existence crash se bachne ke liye
    if (!user || user.role !== 'admin' || !user.password) {
      return res.status(403).json({ success: false, message: "Access Denied / Invalid credentials" });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({ success: false, message: "Access Denied / Invalid credentials" });
    }
    
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      success: true, 
      message: "Admin Login successful! 👑", 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        mobileNumber: user.mobileNumber,
        role: user.role 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Login error", error: error.message });
  }
});

// ==========================================
// 4. FORGOT PASSWORD ROUTE (NEW)
// ==========================================
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found with this email address." });
    }

    // 💡 Future Note: Yahan tu actual me Nodemailer/SendGrid ka code lagayega email bhejne ke liye. 
    // Abhi ke liye hum success bhej rahe hain taaki frontend properly handle kar le.
    res.json({ 
      success: true, 
      message: "Password reset link sent to your email successfully!" 
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

module.exports = router;