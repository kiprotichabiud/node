const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');  // Import the User model
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Secret key for JWT (use a strong, secret key in production)
const JWT_SECRET = 'your_jwt_secret_key';

// Register Route (POST /register)
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user and save to MongoDB
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', error: err });
    }
});

// Login Route (POST /login)
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate a JWT token
        const token = jwt.sign({ id: user._id, name: user.name }, JWT_SECRET, { expiresIn: '1h' });

        // Send token to client
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err });
    }
});

// Protected Route (GET /protected) - Requires JWT token
const authenticate = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach the user data to the request
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

// A protected route (for testing purposes)
app.get('/protected', authenticate, (req, res) => {
    res.json({ message: `Hello ${req.user.name}, you have access to this protected route` });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
