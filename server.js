const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const port = process.env.PORT || 3001;
const doctorRoutes = require('./routes/doctors');
const patientRoutes = require('./routes/patients');
const Doctor = require("./models/Doctor");
const path = require("path");
const cors = require('cors');

// Apply CORS middleware
app.use(cors());

// Configure dotenv
dotenv.config();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Middleware to parse JSON bodies
app.use(express.json());

// Use the API routes
app.use('/api', doctorRoutes);
app.use('/api', patientRoutes);

// Register doctor route
app.post('/register-doctor', async (req, res) => {
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
});

// Login doctor route
app.post('/login-doctor', async (req, res) => {
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
});

// Serve the register.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
