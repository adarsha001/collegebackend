const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
exports.protect = async (req, res, next) => {
  let token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware for teachers
exports.teacherProtect = (req, res, next) => {
  if (req.user && req.user.role === 'teacher') {
    // req.teacher=req.user
    next();
  } else {
    res.status(403).json({ message: 'Only teachers can access this route' });
  }
};
