const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const router = express.Router();

// ==========================================
// 1. REGISTER ROUTE
// ==========================================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, mobileNumber } = req.body;

    if (!name || !email || !password || !mobileNumber) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    if (mobileNumber.length !== 10 || !/^\d{10}$/.test(mobileNumber)) {
      return res.status(400).json({ success: false, message: "Please provide a valid 10-digit mobile number." });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { mobileNumber: mobileNumber } 
        ]
      }
    });

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
    
    const newUser = await prisma.user.create({ 
      data: { name, email, mobileNumber, password: hashedPassword } 
    });
    
    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ 
      success: true, message: "Account created!", token, 
      user: { id: newUser.id, name: newUser.name, email: newUser.email, mobileNumber: newUser.mobileNumber } 
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
    
    if (!user || !user.password) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }
    
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      success: true, message: "Login successful!", token, 
      user: { id: user.id, name: user.name, email: user.email, mobileNumber: user.mobileNumber, role: user.role } 
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
    
    if (!user || user.role !== 'admin' || !user.password) {
      return res.status(403).json({ success: false, message: "Access Denied / Invalid credentials" });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({ success: false, message: "Access Denied / Invalid credentials" });
    }
    
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      success: true, message: "Admin Login successful! 👑", token, 
      user: { id: user.id, name: user.name, email: user.email, mobileNumber: user.mobileNumber, role: user.role } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Login error", error: error.message });
  }
});

// ==========================================
// 🔥 4. FORGOT PASSWORD (GENERATE OTP)
// ==========================================
router.post('/forgot-password', async (req, res) => {
  try {
    const { mobileNumber } = req.body;
    
    const user = await prisma.user.findFirst({ where: { mobileNumber } });
    
    if (!user) {
      return res.status(404).json({ success: false, message: "No account found with this mobile number." });
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // Expiry 15 mins

    // Save OTP to DB
    await prisma.user.update({
      where: { id: user.id },
      data: { otp, otpExpiry }
    });

    res.status(200).json({ 
      success: true, 
      message: "OTP sent successfully!",
      demoOtp: otp // Sending to frontend for demo purposes
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// ==========================================
// 🔥 5. RESET PASSWORD (VERIFY OTP & UPDATE)
// ==========================================
router.post('/reset-password', async (req, res) => {
  try {
    const { mobileNumber, otp, newPassword } = req.body;

    const user = await prisma.user.findFirst({ where: { mobileNumber } });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP entered." });
    }

    if (new Date() > new Date(user.otpExpiry)) {
      return res.status(400).json({ success: false, message: "OTP has expired. Please try again." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear OTP
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        password: hashedPassword,
        otp: null,
        otpExpiry: null
      }
    });

    res.status(200).json({ success: true, message: "Password reset successful! You can now log in." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;