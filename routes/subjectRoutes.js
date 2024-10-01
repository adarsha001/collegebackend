const express = require('express');
const { getAllSubjects, addSubject, deletesubject } = require('../controllers/subjectController');
const router = express.Router();

// Route to get all subjects
router.get('/', getAllSubjects);

// Route to add a new subject (optional)
router.post('/', addSubject);
router.delete('/subjectdelete/:subjectId',deletesubject)
module.exports = router;
