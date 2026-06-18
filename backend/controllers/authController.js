const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// ==========================================
// 1. REGISTER USER CONTROLLER
// ==========================================
exports.register = async (req, res) => {
  try {
    const { name, email, password, mobileNumber } = req.body;

    // Strict Validation
    if (!name || !email || !password || !mobileNumber) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    if (mobileNumber.length !== 10 || !/^\d{10}$/.test(mobileNumber)) {
      return res.status(400).json({ success: false, message: "Please provide a valid 10-digit mobile number." });
    }

    // Check if user already exists (Email OR mobileNumber)
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

    // Hash Password for Security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create New User in Database
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        mobileNumber: mobileNumber, 
        password: hashedPassword,
        role: "customer"
      }
    });

    // Generate JWT Token
    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role },
      process.env.JWT_SECRET || 'your_super_secret_key', 
      { expiresIn: '7d' } 
    );

    // Send Success Response
    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token: token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        mobileNumber: newUser.mobileNumber 
      }
    });

  } catch (error) {
    console.error("Register API Error:", error);
    res.status(500).json({ success: false, message: "Internal server error. Please try again." });
  }
};

// ==========================================
// 2. LOGIN USER CONTROLLER
// ==========================================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid Email or Password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid Email or Password" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'your_super_secret_key', 
      { expiresIn: '7d' }
    );

    res.status(200).json({ 
      success: true, 
      token, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber
      } 
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ==========================================
// 🔥 3. FORGOT PASSWORD (SEND DEMO OTP)
// ==========================================
exports.forgotPassword = async (req, res) => {
  const { mobileNumber } = req.body;

  try {
    // Check if mobile number exists
    const user = await prisma.user.findFirst({ where: { mobileNumber } });
    
    if (!user) {
      return res.status(404).json({ success: false, message: "No account found with this mobile number." });
    }

    // Generate 4-digit Demo OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry

    // Save OTP to DB
    await prisma.user.update({
      where: { id: user.id },
      data: { otp, otpExpiry }
    });

    // Send OTP directly in the response so we can alert it on frontend
    res.status(200).json({ 
      success: true, 
      message: "OTP generated successfully!",
      demoOtp: otp 
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ==========================================
// 🔥 4. VERIFY OTP & RESET PASSWORD
// ==========================================
exports.resetPassword = async (req, res) => {
  const { mobileNumber, otp, newPassword } = req.body;

  try {
    const user = await prisma.user.findFirst({ where: { mobileNumber } });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP entered." });
    }

    if (new Date() > new Date(user.otpExpiry)) {
      return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear OTP fields
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
};