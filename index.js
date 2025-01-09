const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./database');

// comes after dotenv
const campaignsRouter = require('./routes/campaigns');
const userRouter = require('./routes/users');
const cartRouter = require('./routes/cart');
const checkoutRouter = require('./routes/checkout');

const app = express();


// Middlewares
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174']  // Allow requests from your frontend
}));

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
});
