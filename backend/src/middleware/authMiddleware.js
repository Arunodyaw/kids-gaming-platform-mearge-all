const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  console.log('🔍 Auth header:', req.headers.authorization);

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('🔍 Token extracted:', token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('🔍 Decoded token:', decoded);

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }
      next();
    } catch (error) {
      console.error('❌ JWT verification error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
  } else {
    console.log('❌ No Bearer token found in header');
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
};

module.exports = { protect };