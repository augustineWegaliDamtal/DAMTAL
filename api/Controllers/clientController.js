import User from "../Models/userModel.js";


export const getClientDetails = async (req, res) => {
  try {
    const { clientId } = req.params;
    const client = await User.findOne({ accountNumber: req.params.clientId }).select('-password');
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json({
      name: client.name,
      clientId: client._id,
      phone: client.phone,
      balance: client.balance,
      avatar: client.avatarUrl,
      lastDepositDate: client.lastDepositDate,
      accountNumber: client.accountNumber,

    });
  } catch (err) {
    console.error('Client fetch error:', err);
    res.status(500).json({ message: 'Server error retrieving client' });
  }
};
