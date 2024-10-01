const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const studentRoute = require('./routes/studentRoutes'); // Adjust path if needed
const userRoutes=require("./routes/User")
const subjectRoutes=require("./routes/subjectRoutes")
const admin=require('./routes/admin')
const timetableRoutes=require('./routes/timetable')
const attendence=require('./routes/attendence')
// index.js or app.js
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

  
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI);

// Routes

app.use('/api/attendance',attendence)
app.use('/api/students', studentRoute);
app.use('/api/users',userRoutes)

app.use('/api/admin',admin);
app.use('/api/subjects', subjectRoutes);

app.use('/api/timetables', timetableRoutes);



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
