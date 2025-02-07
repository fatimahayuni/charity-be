require('dotenv').config();
const ordersRouter = require('./routes/orders');
const express = require('express');
const cors = require('cors');
const pool = require('./database');

// comes after dotenv
const campaignsRouter = require('./routes/campaigns');
const userRouter = require('./routes/users');
const cartRouter = require('./routes/cart');
const checkoutRouter = require('./routes/checkout');

const app = express();

// Apply raw middleware globally before express.json()
app.use('/api/checkout/webhook', express.raw({ type: 'application/json' }));

// Apply CORS middlewares
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5176', 'http://localhost:5177']  // Allow requests from your frontend
}));


// Apply JSON parsing for all other routes
app.use(express.json());

// Routes
app.use('/api/campaigns', campaignsRouter);
app.use('/api/users', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/orders', ordersRouter);


// Basic route
app.get('/', (req, res) => {
    res.json({ message: "Welcome to our e-commerce API" });
});


// Start the server
const PORT = process.env.PORT || 3000;
console.log(`Server started on port ${PORT}`);
app.listen(PORT, () => {
});