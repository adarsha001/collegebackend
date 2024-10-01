// models/Timetable.js
const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  section: { type: String, required: true },
  period: { type: String, required: true },
  teacherName: { type: String, required: true },
  date: { type: String, required: true }, // Store date as a string or use Date type
  day: { type: String, required: true },
});

const Timetable = mongoose.model('Timetable', timetableSchema);

module.exports = Timetable;
