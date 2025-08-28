import express from 'express';
import { getClientDashboard, getClientNotifications, getClientProfile, updateClientProfile } from '../Controllers/clientCtl.js';
import { verifyToken } from '../utils/verifyUser.js';
import User from '../Models/userModel.js';

const router = express.Router()

router.get('/me', verifyToken, async (req, res, next) => {
  try {
    const userId = req.user._id;
    console.log("🔍 Looking up user:", userId);

    const client = await User.findById(userId).select('name phone avatarUrl role updatedAt');

    if (!client) {
      console.warn("❌ No user found with _id:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    if (client.role !== 'client') {
      console.warn("🚫 Role mismatch. Expected 'client', got:", client.role);
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.json(client);
  } catch (err) {
    console.error("❌ Error in /me route:", err);
    next(err);
  }
});


router.get('/me/notifications',verifyToken, getClientNotifications);
router.get('/me/dashboard',verifyToken, getClientDashboard);
router.patch('/me', verifyToken, updateClientProfile);
router.get('/me/profile',verifyToken, getClientProfile);

export default router