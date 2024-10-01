const express = require('express');
const { registerUser, loginUser, getUserDetails, getAllTeachers, getTeacherSubjects } = require('../controllers/usercontroller'); 
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

// Register Route
router.post('/register', registerUser);

// Login Route
router.post('/login', loginUser);

router.get('/me', authMiddleware, getUserDetails); 
router.get('/teacher', authMiddleware,getAllTeachers);
router.get('/subjects', authMiddleware, getTeacherSubjects);
module.exports = router;
