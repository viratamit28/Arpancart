const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
require('dotenv').config();

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

module.exports = { verifyToken, isAdmin };