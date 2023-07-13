const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the doctor with the provided username
        const doctor = await Doctor.findOne({ username });

        // If doctor is not found or password is incorrect, return an error response
        if (!doctor || !bcrypt.compareSync(password, doctor.password)) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: doctor._id, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return the token in the response
        res.json({ token });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const protect = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Authorization token not found' });
    }

    try {
        // Verify and decode the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.isAdmin = decoded.isAdmin;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = { login, protect };
