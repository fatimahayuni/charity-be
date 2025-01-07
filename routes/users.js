console.log('users.js file loaded');

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Using absolute path to load campaigns.js
const path = require('path');
const campaignsRouter = require(path.join(__dirname, 'campaigns'));  // Remove 'routes' from the path
console.log('campaigns.js loaded');

const userRouter = require('./routes/users');
const cartRouter = require('./routes/cart');
const checkoutRouter = require('./routes/checkout');

const app = express();

// Test route to check if the server responds to /api/users/test
app.get('/api/users/test', (req, res) => {
    res.json({ message: "Test route is working!" });
});

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/campaigns', campaignsRouter);
app.use('/api/users', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/checkout', checkoutRouter);

// Basic route
app.get('/', (req, res) => {
    res.json({ message: "Welcome to our e-commerce API" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
