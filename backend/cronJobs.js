const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Yeh function roz raat 12:01 AM (00:01) par chalega
cron.schedule('1 0 * * *', async () => {
  console.log('Running Daily Subscription Tracker... 🌸');
  const today = new Date();

  try {
    // 1. Un sabhi active subscriptions ko dhundo jinka start date aaj ya aaj se pehle ka hai aur end date bachi hai
    const activeSubscriptions = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        startDate: { lte: today },
        endDate: { gte: today },
        remainingDays: { gt: 0 }
      }
    });

    // 2. Har active subscription ke liye aaj ki delivery entry banao aur remainingDays kam karo
    for (const sub of activeSubscriptions) {
      await prisma.$transaction([
        // Daily delivery create karo
        prisma.subscriptionDelivery.create({
          data: {
            subscriptionId: sub.id,
            deliveryDate: today,
            status: 'PENDING' // Delivery boy isko dekh ke deliver karega
          }
        }),
        // Remaining days 1 minus karo
        prisma.subscription.update({
          where: { id: sub.id },
          data: {
            remainingDays: sub.remainingDays - 1,
            // Agar aaj aakhri din tha, toh status COMPLETED kar do
            status: (sub.remainingDays - 1 === 0) ? 'COMPLETED' : 'ACTIVE'
          }
        })
      ]);
    }
    console.log(`✅ Successfully generated deliveries for ${activeSubscriptions.length} subscriptions.`);
  } catch (error) {
    console.error('❌ Error running daily tracker:', error);
  }
});