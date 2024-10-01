const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path as necessary

exports.authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.user = await User.findById(decoded.id).select('-password'); // Ensure this matches your token payload
    next();
  } catch (error) {
    console.error('Invalid token:', error);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
