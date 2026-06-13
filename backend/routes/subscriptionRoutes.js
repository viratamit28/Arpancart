const express = require('express');
const router = express.Router();

const { 
  createSubscription, 
  pauseSubscription, 
  resumeSubscription, 
  getUserSubscriptions, 
  getAllSubscriptions,
  // 🚨 Naye functions import kiye Plans ke liye
  getActivePlans,
  createPlan,
  deletePlan
} = require('../controllers/subscriptionController');

// ==========================================
// 🧑‍🤝‍🧑 CUSTOMER SUBSCRIPTION ROUTES
// ==========================================
router.post('/create', createSubscription);
router.post('/pause', pauseSubscription);
router.post('/resume', resumeSubscription);
router.get('/user/:userId', getUserSubscriptions);
router.get('/all', getAllSubscriptions);

// ==========================================
// 🌸 SUBSCRIPTION PLANS ROUTES (Naya Code)
// ==========================================
// Frontend pe active plans dikhane ke liye
router.get('/plans', getActivePlans); 

// Admin panel se naya plan banane ke liye
router.post('/admin/plans', createPlan); 

// Admin panel se plan delete karne ke liye
router.delete('/admin/plans/:id', deletePlan);

module.exports = router;