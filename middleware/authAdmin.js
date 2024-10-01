const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authentication middleware to verify the JWT
const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract token from Bearer scheme

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Middleware to check if the user is an admin
const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admins only.' });
    }
    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// Middleware to check if the user is an approved teacher
const teacherMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'teacher' || !user.isApproved) {
      return res.status(403).json({ msg: 'Access denied. Approved teachers only.' });
    }
    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

module.exports = { authMiddleware, adminMiddleware, teacherMiddleware };
