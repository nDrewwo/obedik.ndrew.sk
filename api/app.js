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

app.use(cors({}));
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

        const token = jwt.sign({ UID: user.UID, Username: user.Username, rfid: user.RFID }, secretKey, { expiresIn: '1h' });
        res.send({ token });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// Registration endpoint
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    // Initialize an object to hold potential errors
    let errors = {};

    // Check if all fields are provided
    if (!username || !password || !email) {
        errors.fields = 'Username, password, and email are required';
    }

    // Check if the password is strong enough
    let passwordErrors = [];
    const minLengthRegex = /.{8,}/;
    const digitRegex = /.*\d.*/;
    const uppercaseRegex = /.*[A-Z].*/;
    const lowercaseRegex = /.*[a-z].*/;
    const specialCharRegex = /.*\W.*/;

    if (!minLengthRegex.test(password)) passwordErrors.push("at least 8 characters");
    if (!digitRegex.test(password)) passwordErrors.push("one digit");
    if (!uppercaseRegex.test(password)) passwordErrors.push("one uppercase letter");
    if (!lowercaseRegex.test(password)) passwordErrors.push("one lowercase letter");
    if (!specialCharRegex.test(password)) passwordErrors.push("one special character");

    if (passwordErrors.length > 0) {
        errors.password = `Password is not strong enough. It needs ${passwordErrors.join(", ")}.`;
    }

    // Check if the email is in correct format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errors.email = 'Email is not valid';
    }

    // If there are any errors so far, return them
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, errors });
    }

    try {
        // Check if username or email already exists
        const existingUser = await req.dbConn.query("SELECT * FROM users WHERE Username = ? OR Email = ?", [username, email]);
        if (existingUser.length > 0) {
            errors.existingUser = 'Username or email already in use';
            return res.status(400).json({ success: false, errors });
        }

        // If all checks pass, hash the password and insert the new user
        const hashedPassword = await bcrypt.hash(password, 10);
        await req.dbConn.query("INSERT INTO users (Username, Password, Email) VALUES (?, ?, ?)", [username, hashedPassword, email]);

        // Retrieve the newly registered user's full record to get their UID and any other necessary fields
        const newUser = await req.dbConn.query("SELECT * FROM users WHERE Username = ?", [username]);
        if (newUser.length === 0) {
            throw new Error('User registration successful, but unable to retrieve user data.');
        }
        const user = newUser[0];

    // Generate the token with the same payload structure as in the login endpoint
    // Adjust the payload as necessary based on the available data
    const token = jwt.sign({ UID: user.UID, Username: user.Username, rfid: user.RFID }, secretKey, { expiresIn: '1h' });

    // Respond with the toke

        // Respond with the token
        res.status(201).json({ success: true, message: 'User registered successfully', token });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
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
        const rows = await req.dbConn.query("SELECT Balance, Username, RFID FROM users WHERE UID = ?", [req.user.UID]);
        if (rows.length === 0) {
            return res.status(404).send({ message: 'User not found' });
        }

        const user = rows[0];
        res.send({ username: user.Username, balance: user.Balance, rfid: user.RFID});
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// Example protected endpoint
app.get('/lunches',  async (req, res) => {
    try {
        const rows = await req.dbConn.query("SELECT DATE_FORMAT(DATE, '%Y-%m-%d') as DATE, Choice1, Choice2 FROM lunches");
        res.json(rows);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// Orders endpoint
app.get('/orders', authenticateToken, async (req, res) => {
    try {
        const rows = await req.dbConn.query("SELECT DATE_FORMAT(DATE, '%Y-%m-%d') as Date, CHOICE FROM orders WHERE RFID = ?", [req.user.rfid]);
        res.json(rows);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// Add RFID-based order retrieval endpoint
app.post('/check', async (req, res) => {
    const { rfid } = req.body;
    if (!rfid) {
        return res.status(400).send({ message: 'RFID is required' });
    }

    const today = new Date().toISOString().slice(0, 10); // Format today's date as YYYY-MM-DD

    try {
        const rows = await req.dbConn.query("SELECT CHOICE FROM orders WHERE RFID = ? AND DATE = ?", [rfid, today]);
        if (rows.length === 0) {
            return res.status(404).send({ message: 'No order found for today with the provided RFID' });
        }

        const order = rows[0];
        res.json({ choice: order.CHOICE });

        // After sending the choice, delete the record
        await req.dbConn.query("DELETE FROM orders WHERE RFID = ? AND DATE = ?", [rfid, today]);
    } catch (error) {
        // Handle potential errors
        console.error("Error during order retrieval or deletion:", error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Add an endpoint for form submission to create an order
app.post('/submitOrder', async (req, res) => {
    const { date, rfid, item } = req.body;
    if (!date || !rfid || !item) {
        return res.status(400).send({ message: 'Date, RFID, and item choice are required' });
    }

    try {
        await req.dbConn.query("INSERT INTO orders (Date, RFID, CHOICE) VALUES (?, ?, ?)", [date, rfid, item]);
        res.status(201).send({ message: 'Order submitted successfully' });
    } catch (err) {
        console.error("Error submitting order:", err);
        res.status(500).send({ message: 'Internal server error' });
    }
});

app.get('/burza', async (req, res) => {
    const today = new Date().toISOString().slice(0, 10); // Format today's date as YYYY-MM-DD

    try {
        // Query to count entries for each choice for today's date
        const query = `
            SELECT 
                SUM(CASE WHEN choice = 1 THEN 1 ELSE 0 END) AS countOfChoice1,
                SUM(CASE WHEN choice = 2 THEN 1 ELSE 0 END) AS countOfChoice2
            FROM burza
            WHERE date = ?`;

        const rows = await req.dbConn.query(query, [today]);

        if (rows.length === 0) {
            // If no entries found for today
            return res.status(404).send({ message: 'No entries found for today' });
        }

        const { countOfChoice1, countOfChoice2 } = rows[0];
        res.json({ countOfChoice1, countOfChoice2 });
    } catch (err) {
        console.error("Error retrieving today's entries from burza:", err);
        res.status(500).send({ message: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});
