const User = require('../models/User');

// Get all pending teachers
exports.getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({ role: 'teacher', isApproved: false }).select('name email role isApproved');
    res.json(pendingUsers);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// Approve or reject a teacher
exports.approveUser = async (req, res) => {
  const { userId } = req.params;
  const { approve } = req.body;

  try {
    const user = await User.findById(userId).select('name email role isApproved');
    if (!user || user.role !== 'teacher') {
      return res.status(404).json({ msg: 'User not found or not a teacher' });
    }

    if (approve) {
      user.isApproved = true;
      await user.save();
      res.json({ msg: 'Teacher approved', user });
    } else {
      await user.deleteOne();
      res.json({ msg: 'Teacher rejected and deleted' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// Get all teachers
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).select('name email role isApproved assignedSubjec').populate('assignedSubject');;
    res.json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).send('Server error');
  }
};

// Get all students
exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('name email role section');
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).send('Server error');
  }
};

// Update user details
exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const { name, email, role } = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, { name, email, role }, { new: true }).select('name email role');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all admins
exports.getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('name email role');
    res.json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
