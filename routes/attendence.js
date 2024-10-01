// routes/attendance.js
const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendencecontoller');
const  {authMiddleware}  = require('../middleware/authMiddleware');
const { getStudentAttendance } = require('../controllers/attendencecontoller'); // Assume verifyTeacher is middleware that checks if the user is a teacher

// POST request to mark attendance
router.put('/mark-attendance', authMiddleware, attendanceController.markAttendance);
router.get('/attendance', authMiddleware, getStudentAttendance);
module.exports = router;
