const Patient = require('../models/Patient');

const registerPatient = async (req, res) => {
    try {
        // Extract patient details from the request body
        const { name, aadharNumber } = req.body;

        // Check if a patient with the same Aadhar number already exists
        const existingPatient = await Patient.findOne({ aadharNumber });
        if (existingPatient) {
            return res.status(400).json({ error: 'Patient with the same Aadhar number already exists' });
        }

        // Create a new patient
        const patient = new Patient({ name, aadharNumber, doctorId: req.userId });
        await patient.save();

        res.json({ message: 'Patient registered successfully' });
    } catch (error) {
        console.error('Error in registerPatient:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getPatientData = async (req, res) => {
    try {
        // Retrieve patient data from the database based on the logged-in doctor's ID (req.userId)
        const patients = await Patient.find({ doctorId: req.userId });

        res.json({ patients });
    } catch (error) {
        console.error('Error in getPatientData:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { registerPatient, getPatientData };
