const express = require('express');
const { getUsers, getUserById, createUser, updateUser, deleteUser } = require('../models/users');
const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await getUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a specific user by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`Fetching user with ID: ${id}`);  // Log the ID to check if it's being passed correctly
        const user = await getUserById(id);
        console.log(user);  // Log the result of getUserById
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Create a new user
router.post('/', async (req, res) => {
    const { username, password_hash, role } = req.body;
    try {
        const newUser = await createUser(username, password_hash, role);
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an existing user
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { username, password_hash, role } = req.body;
    try {
        const updatedUser = await updateUser(id, username, password_hash, role);
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a user
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await deleteUser(id);
        res.status(204).end(); // No content to return
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
