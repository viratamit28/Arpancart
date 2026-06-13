const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// ==========================================
// REGISTER USER CONTROLLER
// ==========================================
exports.register = async (req, res) => {
  try {
    const { name, email, password, mobileNumber } = req.body;

    // 1. Strict Validation
    if (!name || !email || !password || !mobileNumber) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    if (mobileNumber.length !== 10 || !/^\d{10}$/.test(mobileNumber)) {
      return res.status(400).json({ success: false, message: "Please provide a valid 10-digit mobile number." });
    }

    // 2. Check if user already exists (Email OR Phone)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { phone: mobileNumber } // Database ka 'phone', frontend ka 'mobileNumber'
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ success: false, message: "Email is already registered. Please login." });
      }
      if (existingUser.phone === mobileNumber) {
        return res.status(400).json({ success: false, message: "Mobile number is already registered. Please login." });
      }
    }

    // 3. Hash Password for Security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create New User in Database
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        phone: mobileNumber, // Mapping frontend variable to DB column
        password: hashedPassword,
        role: "customer"
      }
    });

    // 5. Generate JWT Token
    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role },
      process.env.JWT_SECRET || 'your_super_secret_key', // .env me daalna mat bhulna
      { expiresIn: '7d' } // Token 7 din tak valid rahega
    );

    // 6. Send Success Response
    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token: token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone
      }
    });

  } catch (error) {
    console.error("Register API Error:", error);
    res.status(500).json({ success: false, message: "Internal server error. Please try again." });
  }
};