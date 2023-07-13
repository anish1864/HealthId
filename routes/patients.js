const express = require('express');
const router = express.Router();
const { registerPatient, getPatientData } = require('../controllers/patientController');
const { protect } = require('../controllers/authController');

// Register patient route
router.post('/register-patient', protect, registerPatient);

// Get patient data route
router.get('/patient-data', protect, getPatientData);

module.exports = router;
