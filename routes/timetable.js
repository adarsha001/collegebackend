// routes/timetableRoutes.js
const express = require('express');
const { getTimetables, createOrUpdateTimetable } = require('../controllers/timetableController');
const Timetable = require('../models/Timetable');
const router = express.Router();

// GET all timetables
router.get('/', getTimetables);

// POST to create or update a timetable
router.post('/', createOrUpdateTimetable);
// Assuming you have already set up Express and your Timetable model
router.post('/batch', async (req, res) => {
    const timetableEntries = req.body;
  
    try {
      // Save all entries in one go
      await Timetable.insertMany(timetableEntries);
      res.status(201).json({ message: 'Timetable entries created successfully.' });
    } catch (error) {
      console.error('Error saving timetable entries:', error);
      res.status(500).json({ message: 'Error saving timetable entries' });
    }
  });

  // Fetch timetable for a specific section
router.get('/:section', async (req, res) => {
    try {
      const { section } = req.params;
      const timetableData = await Timetable.find({ section });
  
      if (!timetableData.length) {
        return res.status(404).json({ message: 'No timetable found for this section.' });
      }
  
      res.status(200).json(timetableData);
    } catch (error) {
      console.error('Error fetching timetable:', error);
      res.status(500).json({ message: 'Error fetching timetable' });
    }
  });
  
module.exports = router;
