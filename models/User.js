const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const rolesEnum = ['student', 'teacher', 'admin'];

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: rolesEnum, required: true },
  isApproved: { type: Boolean, default: false },
  assignedSubject: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }], // Array for multiple subjects
  section: { type: String, required: function () { return this.role === 'student'; } },
});

userSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
      isApproved: this.isApproved,
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

const User = mongoose.model('User', userSchema);
module.exports = User;
