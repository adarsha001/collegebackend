// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');
const auth = require('../middleware/auth');
const { getStudentsBySection } = require('../controllers/sectionController');
const User=require("../models/User")
// Register user (student or teacher)
router.post('/register', userController.registerUser);

// Login user (student or teacher)
router.post('/login', userController.loginUser);

// Get user details (auth required)
router.get('/me', auth, userController.getUserDetails);

// Get individual user details by ID
router.get('/:id', auth, userController.getIndividualDetails);

// Get students by section (admin only)
router.get('/view/:section', async (req, res) => {
    try {
      const section = req.params.section;
      console.log(`Fetching students in section: ${section}`); // Debugging line
      const students = await User.find({ section, role: 'student' });
      console.log(`Students found: ${students.length}`); // Debugging line
      res.status(200).json(students);
    } catch (error) {
      console.error('Error fetching students:', error); // Log the error
      res.status(500).json({ message: 'Error fetching students', error });
    }
  });

router.post('/mark', async (req, res) => {
    const { studentId, isPresent } = req.body;

    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        // Create a new attendance record
        const newAttendanceRecord = {
            date: new Date(),
            isPresent,
        };

        // Add the new record to the attendance array
        student.attendance.push(newAttendanceRecord);

        // Save the updated student document
        await student.save();
        res.json({ msg: 'Attendance marked successfully' });
    } catch (error) {
        console.error('Error marking attendance:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Route to get attendance data for a specific student
router.get('/:id/attendance', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Assuming attendance is an array of records in the student model
        res.json({ name: student.name, attendance: student.attendance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});




module.exports = router;
