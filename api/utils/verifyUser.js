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
