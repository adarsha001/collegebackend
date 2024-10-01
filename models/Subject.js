const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensure that subject names are unique
  },
  code: {
    type: String,
    required: false,
    unique: true, // Ensure that subject codes are unique
  },
  
  // Add any other fields here
});

const Subject = mongoose.model('Subject', subjectSchema);
module.exports = Subject;
