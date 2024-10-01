// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyTeacher = async (req, res, next) => {
  // Get the token from the headers (assuming it is passed in the 'Authorization' header as a Bearer token)
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user details from the database using the decoded token ID
    const user = await User.findById(decoded.id);

    // Check if the user is a teacher and is approved by the admin
    if (user && user.role === 'teacher' && user.isApproved) {
      req.user = user; // Attach the user to the request object
      next(); // Proceed to the next middleware or route handler
    } else {
      return res.status(403).json({ message: 'Access denied. You are not authorized to perform this action.' });
    }
  } catch (error) {
    console.error('Error verifying token', error);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { verifyTeacher };
