// controllers/sectionController.js

// const Student = require('../models/Student');

// // Get students by section, accessible only by admins
// exports.getStudentsBySection = async (req, res) => {
//     try {
//         const { section } = req.params;
//         console.log(section)
//         // Check if the user is an admin
     
//         const students = await Student.find({ section });
//         res.status(200).json(students);
//     } catch (err) {
//         res.status(500).json({ message: "Server Error", err });
//     }
// };

