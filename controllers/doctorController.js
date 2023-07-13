const Doctor = require("../models/Doctor");

const registerDoctor = async (req, res) => {
    try {
        // Extract doctor details from the request body
        const { name, username, password } = req.body;

        // Check if a doctor with the same username already exists
        const existingDoctor = await Doctor.findOne({ username });
        if (existingDoctor) {
            return res.status(400).json({ error: 'Doctor with the same username already exists' });
        }

        // Create a new doctor
        const doctor = new Doctor({ name, username, password });
        await doctor.save();

        res.json({ message: 'Doctor registered successfully' });
    } catch (error) {
        console.error('Error in registerDoctor:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const loginDoctor = async (req, res) => {
    try {
        // Extract username and password from the request body
        const { username, password } = req.body;

        // Check if a doctor with the provided username exists
        const doctor = await Doctor.findOne({ username });
        if (!doctor) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Check if the password matches
        if (password !== doctor.password) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Login successful
        res.json({ success: true, message: 'Doctor logged in successfully' });
    } catch (error) {
        console.error('Error in loginDoctor:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { registerDoctor, loginDoctor };
