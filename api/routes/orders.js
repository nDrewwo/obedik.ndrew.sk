const express = require('express');
const pool = require('../db/connection');
const router = express.Router();

const lunchPrice = 2;

// Endpoint to create a new order and deduct balance
router.post('/addOrder', async (req, res) => {
    let connection;
    try {
        const { user_id, choice, date } = req.body;

        if (!user_id || !choice || !date) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Check if the user already has an order for the given date
        const [existingOrder] = await connection.query(
            'SELECT order_id FROM Orders WHERE ref_user_id = ? AND date = ?',
            [user_id, date]
        );

        if (existingOrder) {
            await connection.rollback();
            return res.status(400).json({ error: 'User already has an order for this date' });
        }

        const [user] = await connection.query(
            'SELECT balance FROM Users WHERE user_id = ?',
            [user_id]
        );

        if (!user || user.balance < lunchPrice) {
            await connection.rollback();
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        await connection.query(
            'UPDATE Users SET balance = balance - 2 WHERE user_id = ?',
            [user_id]
        );

        const result = await connection.query(
            'INSERT INTO Orders (ref_user_id, date, lunch_choice, order_status) VALUES (?, ?, ?, ?)',
            [user_id, date, choice, 'pending']
        );

        await connection.commit();

        res.status(201).json({
            message: 'Order created successfully',
            orderId: result.insertId.toString(), // TODO REMOVE
        });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order', details: error.message });
    } finally {
        if (connection) connection.release();
    }
});

// Endpoint to update order status by card_id
router.put('/takout', async (req, res) => {
    let connection;
    try {
        const { card_id, date } = req.body;

        if (!card_id || !date) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        connection = await pool.getConnection();

        const [orderDetails] = await connection.query(
            `SELECT o.lunch_choice, o.ref_user_id, o.order_id
            FROM Orders o
            JOIN Users u ON o.ref_user_id = u.user_id
            WHERE u.card_id = ? AND o.date = ? AND o.order_status = 'pending'`,
            [card_id, date]
        );

        if (!orderDetails) {
            return res.status(404).json({ error: 'No matching pending order found' });
        }

        await connection.query(
            `UPDATE Orders o
            JOIN Users u ON o.ref_user_id = u.user_id
            SET o.order_status = 'taken'
            WHERE u.card_id = ? AND o.date = ?`,
            [card_id, date]
        );

        res.status(200).json({
            message: 'Order status updated',
            lunch_choice: orderDetails.lunch_choice,
            user_id: orderDetails.ref_user_id.toString(), // TODO REMOVE
            order_id: orderDetails.order_id.toString(), // TODO REMOVE
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Failed to update order status', details: error.message });
    } finally {
        if (connection) connection.release();
    }
});

module.exports = router;
