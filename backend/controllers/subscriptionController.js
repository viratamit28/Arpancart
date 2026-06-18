const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ==========================================
// 1. CREATE SUBSCRIPTION API
// ==========================================
const createSubscription = async (req, res) => {
  try {
    const { userId, planId, startDate, durationDays } = req.body;

    if (!userId || !planId || !startDate || !durationDays) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const start = new Date(startDate);
    const end = new Date(startDate);
    end.setDate(end.getDate() + parseInt(durationDays)); 

    const newSubscription = await prisma.subscription.create({
      data: {
        userId: parseInt(userId),
        planId: parseInt(planId), 
        startDate: start,
        endDate: end,
        remainingDays: parseInt(durationDays), 
        status: 'ACTIVE', 
      }
    });

    return res.status(201).json({
      success: true,
      message: "Daily Flower Subscription started successfully! 🌸",
      data: newSubscription
    });

  } catch (error) {
    console.error("Subscription Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Something went wrong while creating the subscription." 
    });
  }
};

// ==========================================
// 2. PAUSE SUBSCRIPTION API
// ==========================================
const pauseSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({ success: false, message: "Subscription ID is required" });
    }

    const subscription = await prisma.subscription.update({
      where: { id: parseInt(subscriptionId) },
      data: {
        status: 'PAUSED',
        pausedAt: new Date(), 
      }
    });

    return res.status(200).json({ success: true, message: "Subscription Paused ⏸️", data: subscription });
  } catch (error) {
    console.error("Pause Error:", error);
    return res.status(500).json({ success: false, message: "Failed to pause subscription" });
  }
};

// ==========================================
// 3. RESUME SUBSCRIPTION API
// ==========================================
const resumeSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({ success: false, message: "Subscription ID is required" });
    }

    const sub = await prisma.subscription.findUnique({ where: { id: parseInt(subscriptionId) } });
    
    if (!sub || sub.status !== 'PAUSED') {
      return res.status(400).json({ success: false, message: "Subscription is not in paused state" });
    }

    const today = new Date();
    const pausedDate = new Date(sub.pausedAt);
    const diffTime = Math.abs(today - pausedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    const newEndDate = new Date(sub.endDate);
    newEndDate.setDate(newEndDate.getDate() + diffDays);

    const updatedSub = await prisma.subscription.update({
      where: { id: parseInt(subscriptionId) },
      data: {
        status: 'ACTIVE',
        endDate: newEndDate, 
        pausedAt: null 
      }
    });

    return res.status(200).json({ success: true, message: "Subscription Resumed ▶️", data: updatedSub });
  } catch (error) {
    console.error("Resume Error:", error);
    return res.status(500).json({ success: false, message: "Failed to resume subscription" });
  }
};

// ==========================================
// 4. GET USER'S SUBSCRIPTIONS (Customer Ke Liye)
// ==========================================
const getUserSubscriptions = async (req, res) => {
  try {
    const { userId } = req.params;
    const subs = await prisma.subscription.findMany({
      where: { userId: parseInt(userId) },
      include: { plan: true }, // Plan ka naam aur details laane ke liye
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json({ success: true, data: subs });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch subscriptions" });
  }
};

// ==========================================
// 5. GET ALL SUBSCRIPTIONS (Admin Ke Liye)
// ==========================================
const getAllSubscriptions = async (req, res) => {
  try {
    const subs = await prisma.subscription.findMany({
      include: { plan: true, user: true }, // User aur Plan dono ki details
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json({ success: true, data: subs });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch all subscriptions" });
  }
};

// ==========================================
// 🌸 6. SUBSCRIPTION PLANS CONTROLLERS (Admin & Frontend)
// ==========================================

// Frontend ke liye: Fetch Active Plans
const getActivePlans = async (req, res) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true }
    });
    res.json({ success: true, data: plans });
  } catch (error) {
    console.error("Fetch plans error:", error);
    res.status(500).json({ success: false, message: "Server Error fetching plans" });
  }
};

// Admin ke liye: Create New Plan
const createPlan = async (req, res) => {
  try {
    // 🔥 YAHAN DESCRIPTION ADD KIYA HAI
    const { name, price, durationDays, description } = req.body; 
    const newPlan = await prisma.subscriptionPlan.create({
      data: {
        name,
        price: parseFloat(price),
        durationDays: parseInt(durationDays),
        description, // 🔥 YAHAN DATABASE MEIN BHEJA HAI
        isActive: true
      }
    });
    res.json({ success: true, data: newPlan });
  } catch (error) {
    console.error("Create plan error:", error);
    res.status(500).json({ success: false, message: "Server Error creating plan" });
  }
};

// Admin ke liye: Delete Plan
const deletePlan = async (req, res) => {
  try {
    await prisma.subscriptionPlan.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ success: true, message: "Plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error deleting plan" });
  }
};

// 🚨 SIRF EK MODULE.EXPORTS RAHEGA YAHAN
module.exports = { 
  createSubscription, 
  pauseSubscription, 
  resumeSubscription, 
  getUserSubscriptions, 
  getAllSubscriptions,
  getActivePlans,
  createPlan,
  deletePlan
};