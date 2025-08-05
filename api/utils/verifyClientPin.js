import bcryptjs from 'bcryptjs';

import User from "../Models/userModel.js";


export const clientPinVerify = async (req, res, next) => {
  try {
    const accountNumber = req.headers['accountnumber']?.trim().toLowerCase();
    const pin = req.headers['pin']?.trim();
    console.log("📥 Final headers received:", req.headers);

    if (!accountNumber || !pin) {
      return res.status(401).json({ message: 'Missing account number or PIN' });
    }

    const client = await User.findOne({ accountNumber, role: 'client' });
    console.log("🧩 DB Result:", client);

    if (!client) {
      console.warn(`Login failed for account ${accountNumber} — no match`);
      return res.status(403).json({ message: 'Account not found or inactive' });
    }

    const isMatch = await bcryptjs.compare(pin, client.pin);
    console.log("🔐 PIN Match:", isMatch);

    if (!isMatch) {
      console.warn(`Login failed for account ${accountNumber} — wrong PIN`);
      return res.status(403).json({ message: 'Invalid PIN' });
    }

    req.user = client;
    next();
  } catch (error) {
    console.error('PIN verification error:', error);
    res.status(500).json({ message: 'Server error during PIN verification' });
  }
};
