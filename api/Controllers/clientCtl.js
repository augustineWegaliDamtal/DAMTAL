import Notification from "../Models/Notifications.js";
import Transaction from "../Models/transactionModel.js";
import User from "../Models/userModel.js";
import bcryptjs from 'bcryptjs';
export const  getClientNotifications = async(req,res,next)=>{
     const userId = req.user._id;
  const notes = await Notification.find({ userId }).sort({ createdAt: -1 });
  res.json(notes);
}

export const getClientDashboard = async (req, res, next) => {
  try {
    const clientId = req.user._id;

    const client = await User.findById(clientId);
    if (!client || client.role !== 'client') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const transactions = await Transaction.find({ clientId });

    const totalDeposits = transactions
      .filter(tx => tx.type === 'deposit')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const totalWithdrawals = transactions
      .filter(tx => tx.type === 'withdrawal')
      .reduce((sum, tx) => sum + tx.amount, 0);
const nestedBalance = totalDeposits - totalWithdrawals
    res.json({
    name: client.name,
    balance: client.balance || 0,
    totalWithdrawals,
    totalDeposits,        // optional if you still need it
    nestedBalance,        // <-- newly added
  });
  } catch (error) {
    console.error('❌ Dashboard fetch error:', error);
    next(error);
  }
};

//profile

const isHashed = (value) => typeof value === 'string' && value.startsWith('$2'); // bcrypt prefix

const normalizeGhPhone = (raw) => {
  if (!raw) return '';
  let v = String(raw).trim().replace(/\s+/g, '');
  // Convert +233XXXXXXXXX -> 0XXXXXXXXX
  if (/^\+233\d{9}$/.test(v)) return '0' + v.slice(4);
  // Keep 0XXXXXXXXX
  if (/^0\d{9}$/.test(v)) return v;
  return v; // return as-is; validation will catch invalids
};

const validatePhoneGh = (phone) => /^0\d{9}$/.test(phone); // 10 digits, starts with 0
const validatePin = (pin) => /^\d{4,6}$/.test(pin); // numeric, 4–6 digits

export const updateClientProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1) Ensure requester is a client
    const client = await User.findById(userId);
    if (!client || client.role !== 'client') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    // 2) Pull incoming fields
    const { phone: incomingPhone, currentPin, newPin } = req.body;
    const updates = {};

    // 3) Phone update (optional)
    if (typeof incomingPhone !== 'undefined') {
      const phone = normalizeGhPhone(incomingPhone);
      if (!validatePhoneGh(phone)) {
        return res.status(400).json({ message: 'Invalid phone format. Use 0XXXXXXXXX or +233XXXXXXXXX.' });
      }
      updates.phone = phone;
    }

    // 4) PIN update (optional, requires currentPin if a PIN already exists)
    if (typeof newPin !== 'undefined' && newPin !== '') {
      if (!validatePin(newPin)) {
        return res.status(400).json({ message: 'PIN must be 4–6 digits.' });
      }

      const hasExistingPin = Boolean(client.pin);

      if (hasExistingPin) {
        if (!currentPin) {
          return res.status(400).json({ message: 'Current PIN is required to set a new PIN.' });
        }

        // Support both hashed and legacy-plain existing PINs
        let matches = false;
        if (isHashed(client.pin)) {
          matches = await bcryptjs.compare(currentPin, client.pin);
        } else {
          matches = currentPin === client.pin;
        }

        if (!matches) {
          return res.status(400).json({ message: 'Current PIN is incorrect.' });
        }
      }

      const hashedPin = await bcryptjs.hash(String(newPin), 10);
      updates.pin = hashedPin;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update.' });
    }

    // 5) Persist updates
    const updated = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true, context: 'query' }
    );

    // 6) Optional: drop a notification for audit/user feedback
    try {
      const changed = [];
      if ('phone' in updates) changed.push('phone');
      if ('pin' in updates) changed.push('PIN');
      if (changed.length > 0) {
        await Notification.create({
          userId,
          message: `Profile updated: ${changed.join(' & ')}.`,
        });
      }
    } catch (e) {
      // Non-fatal: don’t block the response if notification fails
      console.warn('Notification creation failed:', e?.message || e);
    }

    // 7) Return safe payload
    return res.json({
      message: 'Profile updated successfully',
      name: updated.name,
      phone: updated.phone,
      avatarUrl: updated.avatarUrl,
      role: updated.role,
      updatedAt: updated.updatedAt,
    });
  } catch (err) {
    console.error('Profile update error:', err);
    return next(err);
  }
};

export const getClientProfile = async (req, res, next) => {
  try {
    const clientId = req.user._id;

    const client = await User.findById(clientId).select('-password -pin');
    if (!client || client.role !== 'client') {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json({
      name: client.name,
      phone: client.phone,
      accountNumber: client.accountNumber,
      avatarUrl: client.avatarUrl,
      role: client.role,
      updatedAt: client.updatedAt
    });
  } catch (error) {
    console.error('❌ Profile fetch error:', error);
    next(error);
  }
};
