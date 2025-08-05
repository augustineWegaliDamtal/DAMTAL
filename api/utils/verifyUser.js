import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  const cookieToken = req.cookies?.access_token;
  const authHeader = req.headers.authorization;
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  const token = headerToken || cookieToken;

  if (!token) {
    console.warn("⚠️ No token found for protected route:", req.originalUrl);
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err || !decodedUser) {
      console.error('❌ Token verification failed:', err?.message || 'User decoding failed');
      return next(errorHandler(403, 'Token is invalid'));
    }

    req.user = decodedUser;

    // ✅ Safe logging now that req.user exists
    console.log("🔐 Token decoded _id:", req.user._id);

    next();
  });
};

export const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admins only' });
    }

    req.user = decoded; // Optional: add user info to request
    next();
  } catch (err) {
    console.error('🔴 Admin check failed:', err);
    res.status(403).json({ error: 'Invalid token' });
  }
};
