const Attendance = require('../models/Attendance');
const User = require('../models/User');

exports.markAttendance = async (req, res) => {
  try {
    const { section, periodName, attendanceData } = req.body; 
    const teacherId = req.user.id; // Assuming teacher's id is coming from a JWT token
    const teacher = await User.findById(teacherId); // Fetch the teacher details

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Fetch all students in the specified section
    const students = await User.find({ section, role: 'student' });

    if (!students.length) {
      return res.status(404).json({ message: 'No students found in this section' });
    }

    // Loop through each student to save or update attendance
    for (let student of students) {
      console.log(`Processing attendance for student: ${student.name}`);

      const attendanceRecord = attendanceData.find((record) => String(record.studentId) === String(student._id));

      if (attendanceRecord) {
        // Check if the attendance already exists for the student
        let existingAttendance = await Attendance.findOne({ student: student._id });

        const today = new Date().toISOString().split('T')[0]; // Format today's date

        if (existingAttendance) {
          // Append new period attendance to existing attendance record for today
          const existingRecordForToday = existingAttendance.attendanceRecords.find(
            (record) => record.date.toISOString().split('T')[0] === today
          );

          if (existingRecordForToday) {
            // Update period attendance if a record exists for today
            const periodExists = existingRecordForToday.periods.find(
              (p) => p.periodName === periodName
            );

            if (periodExists) {
              // Update the existing period attendance
              periodExists.isPresent = attendanceRecord.isPresent;
              periodExists.timeMarked = Date.now();
              periodExists.teacherName = teacher.name; // Update teacher name for the period
            } else {
              // Add new period for today
              existingRecordForToday.periods.push({
                periodName,
                isPresent: attendanceRecord.isPresent,
                timeMarked: Date.now(),
                teacherName: teacher.name, // Include teacher's name
              });
            }
          } else {
            // Create a new attendance record for today
            existingAttendance.attendanceRecords.push({
              date: new Date(),
              periods: [
                {
                  periodName,
                  isPresent: attendanceRecord.isPresent,
                  timeMarked: Date.now(),
                  teacherName: teacher.name, // Include teacher's name
                },
              ],
            });
          }

          // Save the updated attendance record
          await existingAttendance.save();
          console.log(`Updated attendance for student: ${student.name}`);
        } else {
          // Create a new attendance record for the student if none exists
          const newAttendance = new Attendance({
            student: student._id,
            attendanceRecords: [
              {
                date: new Date(),
                periods: [
                  {
                    periodName,
                    isPresent: attendanceRecord.isPresent,
                    timeMarked: Date.now(),
                    teacherName: teacher.name, // Assign the teacher's name
                  },
                ],
              },
            ],
          });

          await newAttendance.save();
          console.log(`Created new attendance for student: ${student.name}`);
        }
      }
    }

    res.status(200).json({ message: 'Attendance marked successfully' });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.user.id; // Assuming the student ID is extracted from JWT

    // Find attendance for the logged-in student
    const attendance = await Attendance.findOne({ student: studentId })

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance not found for this student' });
    }

    res.status(200).json(attendance);
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
