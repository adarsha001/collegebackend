// routes/admin.js
const express = require('express');
const { getPendingUsers, approveUser, getTeachers, getStudents, updateUser, deleteUser, getAdmins } = require('../controllers/adminController');
const  {authMiddleware} = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/authAdmin');
const Subject = require('../models/Subject');
const router = express.Router();

// Admin route to get pending users
router.get('/pending-users', authMiddleware, adminMiddleware, getPendingUsers);

// Admin route to approve/reject users
router.post('/approve-user/:userId', authMiddleware, adminMiddleware, approveUser);

router.get('/teachers', authMiddleware, adminMiddleware, getTeachers);

// Admin route to get all students
router.get('/students', authMiddleware, adminMiddleware, getStudents);
router.put('/update-user/:userId', authMiddleware,adminMiddleware, updateUser);
router.delete('/delete-user/:userId', authMiddleware,adminMiddleware, deleteUser);
router.get('/admins', authMiddleware,adminMiddleware, getAdmins);
router.post('/create-subject', adminMiddleware, async (req, res) => {
    const { name, code, teacherId } = req.body;
  
    try {
      const newSubject = new Subject({ name, code, teacherId });
      await newSubject.save();
      res.status(201).json({ message: 'Subject created successfully', subject: newSubject });
    } catch (error) {
      res.status(400).json({ error: 'Error creating subject', details: error.message });
    }
  });

  // Admin assigns a teacher to a subject
router.post('/assign-subject', adminMiddleware, async (req, res) => {
    const { subjectId, teacherId } = req.body;
  
    try {
      const subject = await Subject.findById(subjectId);
      if (!subject) return res.status(404).json({ message: 'Subject not found' });
  
      subject.teacherId = teacherId;
      await subject.save();
      res.status(200).json({ message: 'Subject assigned to teacher successfully', subject });
    } catch (error) {
      res.status(500).json({ message: 'Error assigning subject', details: error.message });
    }
  });
  
module.exports = router;
