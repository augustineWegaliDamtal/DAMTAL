import Notification from "../Models/Notifications.js";
import Transaction from "../Models/transactionModel.js";
import User from "../Models/userModel.js";

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