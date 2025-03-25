const express = require('express');
const cors = require('cors');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/', orderRoutes); // Mount order routes at the root path
app.use('/', authRoutes);  // Mount auth routes at the root path

app.get('/', (req, res) => {
  res.send('api-obedik.ndrew.sk is up and running!');
});

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});