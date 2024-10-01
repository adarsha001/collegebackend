// controllers/timetableController.js
const Timetable = require('../models/Timetable');

// Fetch all timetables
const getTimetables = async (req, res) => {
  try {
    const timetables = await Timetable.find({});
    res.status(200).json(timetables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create or update a timetable entry
const createOrUpdateTimetable = async (req, res) => {
  const { section, period, teacherName, date, day } = req.body;

  try {
    // Check if the entry already exists
    const existingEntry = await Timetable.findOne({ section, period });

    if (existingEntry) {
      // Update the existing entry
      existingEntry.teacherName = teacherName;
      existingEntry.date = date;
      existingEntry.day = day;
      await existingEntry.save();
      return res.status(200).json(existingEntry);
    } else {
      // Create a new timetable entry
      const newTimetable = new Timetable({ section, period, teacherName, date, day });
      await newTimetable.save();
      return res.status(201).json(newTimetable);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTimetables, createOrUpdateTimetable };
