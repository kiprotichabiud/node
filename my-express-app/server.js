const express = require('express');
const path = require('path');
const app = express();

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Handle POST request
app.post('/submit', (req, res) => {
    const name = req.body.name; // Access form data from the request body
    res.send(`Form submitted! Hello, ${name}`);
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});
