const cors = require('cors');
const express = require('express');
const mariadb = require('mariadb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cafeteria_db',
    connectionLimit: 5,
    acquireTimeout: 10000 
});

async function getConnection() {
    let conn;
    try {
        conn = await pool.getConnection();
        conn.on('error', async (err) => {
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.error('Database connection was closed.');
            } else {
                throw err;
            }
        });
    } catch (err) {
        console.error('Error getting a database connection: ', err);
        throw err;
    }
    return conn;
}

app.use(cors());

app.use(express.json());

app.use(async (req, res, next) => {
    try {
        req.dbConn = await getConnection();
        next();
    } catch (err) {
        next(err);
    }
});

app.use((req, res, next) => {
    res.on('finish', () => {
        if (req.dbConn) req.dbConn.release();
    });
    next();
});

app.get('/lunches', async (req, res) => {
    try {
        const rows = await req.dbConn.query("SELECT LID, DATE_FORMAT(DATE, '%Y-%m-%d') as DATE, Choice1, Choice2 FROM lunches");
        res.json(rows);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});