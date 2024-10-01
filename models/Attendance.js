const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
// Optional field for teacher's name
  attendanceRecords: [
    {
      date: { type: Date, required: true },
      periods: [
        {
          periodName: { type: String, required: true },
          isPresent: { type: Boolean, required: true },
          timeMarked: { type: Date, required: true },
          teacherName: { type: String, required: true },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Attendance", attendanceSchema);
