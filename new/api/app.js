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

const secretKey = 'lubimMarekovPeknyPipik'; // Use a secure secret key for JWT

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

// Registration endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send({ message: 'Username and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await req.dbConn.query("INSERT INTO users (Username, Password) VALUES (?, ?)", [username, hashedPassword]);
        res.status(201).send({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send({ message: 'Username and password are required' });
    }

    try {
        const rows = await req.dbConn.query("SELECT * FROM users WHERE Username = ?", [username]);
        if (rows.length === 0) {
            return res.status(401).send({ message: 'Invalid username or password' });
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.Password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ UID: user.UID, Username: user.Username }, secretKey, { expiresIn: '1h' });
        res.send({ token });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send({ message: 'Access denied' });

    const tokenPart = token.split(' ')[1]; // Ensure correct token extraction
    jwt.verify(tokenPart, secretKey, (err, user) => {
        if (err) return res.status(403).send({ message: 'Invalid token' });
        req.user = user;
        next();
    });
}


// Dashboard endpoint
app.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        const rows = await req.dbConn.query("SELECT Balance, Username FROM users WHERE UID = ?", [req.user.UID]);
        if (rows.length === 0) {
            return res.status(404).send({ message: 'User not found' });
        }

        const user = rows[0];
        res.send({ username: user.Username, balance: user.Balance });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// Example protected endpoint
app.get('/lunches', authenticateToken, async (req, res) => {
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
