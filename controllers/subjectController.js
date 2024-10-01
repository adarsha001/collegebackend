// controllers/subjectController.js


const Subject = require('../models/Subject');

// Get all subjects
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find() ;
    res.json(subjects); // Send the subjects as a response
  } catch (error) {
    console.error('Error fetching subjects:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add a new subject (Optional)
exports.addSubject = async (req, res) => {
    const { name, code } = req.body;
    
    if (!name || !code) {
      return res.status(400).json({ message: "Name and code are required" });
    }
  
    try {
      const newSubject = new Subject({ name, code });
      await newSubject.save();
      res.status(201).json({ message: 'Subject added successfully' });
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error
        return res.status(400).json({ message: `Subject with name '${name}' or code '${code}' already exists` });
      }
      res.status(500).json({ message: 'Error adding subject' });
    }
  };

  exports.deletesubject = async(req,res)=>{
    const {subjectId}=req.params;

    try {
      const subject=await Subject.findByIdAndDelete(subjectId);
      if(!subject){
        return res.status(404).json({ message: 'Subject not found' });
      }
      res.json({message:'subject deleted'})
    } catch (error) {
      
    }
  }