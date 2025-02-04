const express = require('express');
const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Example: In-memory data store
let users = [
    { id: 1, name: 'Abiud' },
    { id: 2, name: 'John' }
];

// GET: Get all users
app.get('/api/users', (req, res) => {
    res.json(users);
});

// GET: Get a specific user by ID
app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).send('User not found');
    res.json(user);
});

// POST: Add a new user
app.post('/api/users', (req, res) => {
    const newUser = {
        id: users.length + 1,
        name: req.body.name
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

// PUT: Update user data by ID
app.put('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).send('User not found');

    user.name = req.body.name;
    res.json(user);
});

// DELETE: Remove user by ID
app.delete('/api/users/:id', (req, res) => {
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex === -1) return res.status(404).send('User not found');

    const deletedUser = users.splice(userIndex, 1);
    res.json(deletedUser);
});

// Start the server
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
