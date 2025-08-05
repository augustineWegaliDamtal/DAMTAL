import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../Models/userModel.js';
import { errorHandler } from '../utils/error.js';

// Register new user
export const Registerations = async (req, res, next) => {
  const { name, username, email, password, phone, gender, address, role, accountNumber } = req.body;

  try {
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'Email already exists' });
    }

    if (accountNumber) {
      const existingAccount = await User.findOne({ accountNumber });
      if (existingAccount) return res.status(400).json({ message: 'Account number already in use' });
    }

    let finalAccountNumber;
    console.log('🧠 Received role:', role);
console.log('🔐 Authenticated user role:', req.user?.role);


    if (role === 'admin' || role === 'agent') {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Only admins can assign roles' });
      }

      if (username) {
        const existingUsername = await User.findOne({ username });
        if (existingUsername) return res.status(400).json({ message: 'Username already exists' });
      }

      if (!password) return res.status(400).json({ message: 'Password required for staff' });
      if (!accountNumber) return res.status(400).json({ message: 'Account number required for staff' });

      finalAccountNumber = accountNumber;
    } else {
      // Random account number generator
      let attempt = 0;
      do {
        const letterSeed = Math.floor(Math.random() * 1296);
        const letters = letterSeed.toString(36).padStart(2, 'a');
        const digitSeed = Math.floor(Math.random() * 100);
        const digits = digitSeed.toString().padStart(2, '0');
        finalAccountNumber = `c-${letters}${digits}`;

        const exists = await User.findOne({ accountNumber: finalAccountNumber });
        if (!exists) break;

        attempt++;
        if (attempt > 10) return res.status(500).json({ message: 'Could not generate unique account number' });
      } while (true);

      console.log("✅ Generated account number:", finalAccountNumber);
    }

    if (!finalAccountNumber) {
      return res.status(400).json({ message: 'Account number could not be generated' });
    }

    const hashedPassword = password ? bcryptjs.hashSync(password, 10) : null;

    const newUser = new User({
      username,
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || 'client',
      gender,
      agentUsername: req.user.username,

      address,
      accountNumber: finalAccountNumber
    });

    await newUser.save();
    const savedUser = await User.findById(newUser._id);

    res.status(201).json({
  success: true,
  message: 'User created',
  userId: savedUser._id,
  accountNumber: savedUser.accountNumber
});


  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
};

// Staff Signin
export const Signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const validUser = await User.findOne({ email });
    if (!validUser || !bcryptjs.compareSync(password, validUser.password)) {
      return next(errorHandler(400, 'Invalid email or password'));
    }

    const token = jwt.sign(
      {
        _id: validUser._id,
        username: validUser.username,
        role: validUser.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const { password: pass, ...userData } = validUser._doc;

    // ✅ Send token in cookie (optional)
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax'
    });

    // ✅ Send user object + token in flat response
    res.status(200).json({
      ...userData,
      token // ✅ frontend can store this in localStorage
    });

  } catch (error) {
    console.error('Signin error:', error);
    next(error);
  }
};

// Signout
export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User signed out');
  } catch (error) {
    next(error);
  }
};

// ✅ Check if PIN is already set
export const checkClientStatus = async (req, res, next) => {
  try {
    const { accountNumber } = req.params;
    const client = await User.findOne({ accountNumber });

    if (!client) return res.status(404).json({ message: 'Client not found' });

    const pinSet = typeof client.pin === 'string' && client.pin.length > 0;
    console.log("🔍 PIN status for", accountNumber, ":", pinSet);

    res.status(200).json({ pinSet });
  } catch (error) {
    console.error("PIN status error:", error);
    next(error);
  }
};

// ✅ Set new PIN securely
export const setPinClient = async (req, res, next) => {
  try {
    const { accountNumber, pin } = req.body;
    if (!accountNumber || !pin) {
      return res.status(400).json({ message: 'Account number and PIN are required' });
    }

    const client = await User.findOne({ accountNumber });
    if (!client) return res.status(404).json({ message: 'Client not found' });

    if (typeof client.pin === 'string' && client.pin.length > 0) {
      return res.status(400).json({ message: 'PIN already set' });
    }

    const hashedPin = await bcryptjs.hash(pin, 10);
    await User.findByIdAndUpdate(client._id, { pin: hashedPin }, { new: true });

    console.log("✅ PIN successfully saved for:", accountNumber);
    res.status(200).json({ message: 'PIN set successfully', pinSet: true });
  } catch (error) {
    console.error("PIN setup error:", error);
    next(error);
  }
};

// ✅ Client login using PIN
export const loginClient = async (req, res, next) => {
  try {
    const { accountNumber, pin } = req.body;
    if (!accountNumber || !pin) {
      return res.status(400).json({ message: 'Account number and PIN are required' });
    }

    const client = await User.findOne({ accountNumber });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    if (!client.pin) return res.status(400).json({ message: 'PIN not set — please create your PIN first' });

    const isMatch = await bcryptjs.compare(pin, client.pin);
    if (!isMatch) return res.status(401).json({ message: 'Invalid PIN' });

    const token = jwt.sign(
      { id: client._id, role: 'client' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({success: true, message: 'Login successful', token });
  } catch (error) {
    console.error("Client login error:", error);
    next(error);
  }
};
