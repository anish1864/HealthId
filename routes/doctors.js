const express = require('express');
const router = express.Router();
const { registerDoctor, loginDoctor } = require('../controllers/doctorController');

// Register doctor route
router.post('/register-doctor', registerDoctor);

// Login doctor route
router.post('/login', loginDoctor);

module.exports = router;
