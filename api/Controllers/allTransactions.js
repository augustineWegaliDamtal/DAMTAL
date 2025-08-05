import Notification from "../Models/Notifications.js";
import Transaction from "../Models/transactionModel.js";
import User from "../Models/userModel.js";


// 💸 Deposit controller (admin or agent only)
export const deposit = async (req, res, next) => {
  try {
    const { accountNumber, amount } = req.body;

    if (!req.user || !['admin', 'agent'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Only admins or agents can process deposits' });
    }

    const client = await User.findOne({ accountNumber });
    if (!client || client.role !== 'client') {
      return res.status(404).json({ success: false, message: 'Valid client not found' });
    }

    const currentBalance = client.balance || 0;
    const newBalance = currentBalance + amount;
    client.balance = newBalance;
    await client.save();

    await Transaction.create({
      clientId: client._id,
      agentId: req.user._id,
      type: 'deposit',
      amount,
      balanceAfter: newBalance
    });
   
await Notification.create({
  userId: client._id,
  message: `₵${amount} has been deposited into your account.`,
  type: 'deposit',
  createdBy: req.user._id
});
    res.status(200).json({ success: true, message: 'Deposit successful', newBalance });

  } catch (error) {
    console.error('❌ Deposit error:', error);
    next(error);
  }
};

// 🔁 Withdrawal controller (admin-only)
export const withdrawFunds = async (req, res, next) => {
  try {
    const { accountNumber, amount } = req.body;

    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only admins can process withdrawals' });
    }

    const client = await User.findOne({ accountNumber });
    if (!client || client.role !== 'client') {
      return res.status(404).json({ success: false, message: 'Valid client not found' });
    }

    const currentBalance = client.balance || 0;
    if (amount > currentBalance) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    const newBalance = currentBalance - amount;
    client.balance = newBalance;
    await client.save();

    await Transaction.create({
      clientId: client._id,
      agentId: req.user._id,
      type: 'withdrawal',
      amount,
      balanceAfter: newBalance
    });

    res.status(200).json({ success: true, message: 'Withdrawal successful', newBalance });

  } catch (error) {
    console.error('❌ Withdrawal error:', error);
    next(error);
  }
};

// 📊 Unified transaction fetch for smart table (with filters in AG Grid)
export const getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find()
      .populate('clientId', 'name accountNumber username')
      .populate('agentId', 'username')
      .sort({ createdAt: -1 }); // 🕒 Newest first

    res.status(200).json(transactions);
  } catch (error) {
    console.error('❌ Get transactions error:', error);
    next(error);
  }
};

// 💰 Get only deposits (for isolated views)
export const getAllDeposits = async (req, res, next) => {
  try {
    const deposits = await Transaction.find({ type: 'deposit' })
      .populate('clientId', 'accountNumber username')
      .populate('agentId', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json(deposits);
  } catch (error) {
    console.error('❌ Get deposits error:', error);
    next(error);
  }
};

// 💸 Get only withdrawals (for isolated views)
export const getAllWithdrawals = async (req, res, next) => {
  try {
    const withdrawals = await Transaction.find({ type: 'withdrawal' })
      .populate('clientId', 'accountNumber username')
      .populate('agentId', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json(withdrawals);
  } catch (error) {
    console.error('❌ Get withdrawals error:', error);
    next(error);
  }
};

// 🧹 Transaction deletion (admin or agent only)
export const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.user || !['admin', 'agent'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to delete transactions' });
    }

    await Transaction.findByIdAndDelete(id);
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('❌ Delete transaction error:', error);
    next(error);
  }
};
