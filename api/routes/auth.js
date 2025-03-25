const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db/connection');
const router = express.Router();

// Endpoint to handle user login
router.post('/login', async (req, res) => {
    let connection;
    try {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Missing email or password' });
    }

    connection = await pool.getConnection();

    const [user] = await connection.query(
        'SELECT user_id, password, role, admin FROM Users WHERE mail = ?',
        [email]
    );

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password' });
    }

    res.status(200).json({
        message: 'Login successful',
        user: {
            user_id: user.user_id,
            role: user.role,
            admin: user.admin,
        },
    });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Failed to login', details: error.message });
    } finally {
        if (connection) connection.release();
    }
});

module.exports = router;
