require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const pool = require('./database');
const jwt = require('jsonwebtoken')

// comes after dotenv
// Import routers
const ordersRouter = require('./routes/orders');
const campaignsRouter = require('./routes/campaigns');
const userRouter = require('./routes/users');
const cartRouter = require('./routes/cart');
const checkoutRouter = require('./routes/checkout');

const app = express();

// Apply raw middleware globally before express.json()
app.use('/api/checkout/webhook', express.raw({ type: 'application/json' }));

// Apply CORS middlewares
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5176', 'http://localhost:5177', 'http://localhost:5178'],  // Allow requests from your frontend,
    credentials: true,  // Allow cookies to be sent

}));

// Middleware to parse cookies
app.use(cookieParser());

// Apply JSON parsing for all other routes
app.use(express.json());

// Routes
app.use('/api/campaigns', campaignsRouter);
app.use('/api/users', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/orders', ordersRouter);


// Endpoint to chekc login status
app.get('/auth/status', (req, res) => {
    const token = req.cookies.jwt;  // Get the token from the cookie
    console.log("token in index.js", token)
    if (!token) {
        return res.json({ isLoggedIn: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        return res.json({ isLoggedIn: true, userId: decoded.userId });
    } catch (error) {
        console.log("error", error)
        return res.json({ isLoggedIn: false });
    }
});

app.post('/auth/logout', (req, res) => {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'Lax', secure: true });
    res.json({ message: "Logged out successfully" });
});


// Basic route
app.get('/', (req, res) => {
    res.json({ message: "Welcome to our e-commerce API" });
});


// Start the server
const PORT = process.env.PORT || 3000;
console.log(`Server started on port ${PORT}`);
app.listen(PORT, () => {
});