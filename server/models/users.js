const pool = require('../connect_db');

// Get all users
const getUsers = async () => {
    const result = await pool.query('SELECT * FROM users');
    return result.rows;
};

// Get a user by username
const getUserByUsername = async (username) => {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
};

// Get a user by ID
const getUserById = async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
};

// Create a new user
const createUser = async (username, password_hash, role) => {
    const result = await pool.query(
        'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
        [username, password_hash, role]
    );
    return result.rows[0];
};

// Update user details
const updateUser = async (id, username, password_hash, role) => {
    const result = await pool.query(
        'UPDATE users SET username = $1, password_hash = $2, role = $3 WHERE id = $4 RETURNING *',
        [username, password_hash, role, id]
    );
    return result.rows[0];
};

//Delete user
const deleteUser = async (id) => {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser, getUserByUsername};
