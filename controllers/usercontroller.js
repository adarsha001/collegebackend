const User = require('../models/User');
const Subject = require('../models/Subject');
const Attendance = require('../models/Attendance');
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res) => {
  const { name, email, password, role, assignedSubject, section } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      isApproved: role === 'teacher' ? false : true, // Teachers need admin approval
      section: role === 'student' ? section : null,  // Section only for students
    });

    // Validate assigned subjects for teachers
    if (role === 'teacher' && assignedSubject.length > 0) {
      const subjects = await Subject.find({ _id: { $in: assignedSubject } });
      if (subjects.length !== assignedSubject.length) {
        return res.status(400).json({ msg: 'One or more selected subjects are invalid' });
      }
      user.assignedSubject = assignedSubject; // Store multiple subject IDs
    }

    // Save the user
    await user.save();

    // Create attendance record if role is 'student'
    if (role === 'student') {
      const newAttendance = new Attendance({
        student: user._id,
        teacher: null, // Teacher assigned when attendance is marked
        attendanceRecords: [],
      });
      await newAttendance.save();
    }

    const message = role === 'teacher'
      ? 'Registration successful. Waiting for admin approval.'
      : 'Registration successful. You can now log in.';

    res.status(201).json({ message });
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).send('Server error');
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if the teacher is approved
    if (user.role === 'teacher' && !user.isApproved) {
      return res.status(403).json({ msg: 'Your account is pending admin approval.' });
    }

    // Generate token and return user details
    const token = user.generateToken();

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
      },
    });
  } catch (error) {
    console.error('Error during login:', error.message);
    // Send the error response as JSON
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get User Details
exports.getUserDetails = async (req, res) => {
  try {
    // Find user by ID from the request
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Return user details
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
    });
  } catch (error) {
    console.error('Error fetching user details:', error.message);
    res.status(500).send('Server error');
  }
};

// Get Individual Student/Teacher Details
exports.getIndividualDetails = async (req, res) => {
  try {
    // Find user by ID from the params
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Return individual user details
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
    });
  } catch (error) {
    console.error('Error fetching individual user details:', error.message);
    res.status(500).send('Server error');
  }
};

// Get All Teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).select('-password').populate("assignedSubject"); // Exclude password from response
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getTeacherSubjects = async (req, res) => {
  try {
    const teacherId = req.user.id; // Assuming JWT middleware has added user info
    const teacher = await User.findById(teacherId).populate('assignedSubject');

    if (!teacher || teacher.role !== 'teacher') {
      return res.status(403).json({ message: 'Access forbidden: Not a teacher' });
    }

    // Return the populated subjects
    res.status(200).json(teacher.assignedSubject);
  } catch (error) {
    console.error('Error fetching subjects:', error); // Log the error for debugging
    res.status(500).json({ message: 'Error fetching subjects', error });
  }
};
