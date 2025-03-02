require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const pool = require('./database');
const jwt = require('jsonwebtoken');

// Import routers
const ordersRouter = require('./routes/orders');
const campaignsRouter = require('./routes/campaigns');
const userRouter = require('./routes/users');
const cartRouter = require('./routes/cart');
const checkoutRouter = require('./routes/checkout');

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5174', // frontend URL
    credentials: true, // Allow credentials (cookies)
}));

// Middleware to parse cookies
app.use(cookieParser());

// Middleware for Stripe webhook (must be above express.json())
app.use('/api', require('./routes/stripe'));


// Apply JSON parsing for all routes except for Stripe routes
app.use(express.json());

// Routes
app.use('/api/campaigns', campaignsRouter);
app.use('/api/users', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/orders', ordersRouter);


// Endpoint to check login status
app.get('/auth/status', (req, res) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.json({ isLoggedIn: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        return res.json({ isLoggedIn: true, userId: decoded.userId });
    } catch (error) {
        console.log("error", error);
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


// Function to start the server
function startServer(port, maxRetries = 10) {
    let attempts = 0;

    const tryStartServer = () => {
        if (attempts >= maxRetries) {
            console.log("Unable to find an available port after several attempts.");
            return;
        }

        const server = app.listen(port, (err) => {
            if (err) {
                attempts++;
                console.log(`Port ${port} is in use, trying another one...`);
                server.close(() => {
                    setTimeout(() => {
                        startServer(port + 1); // Retry with the next port after a brief delay
                    }, 1000); // Delay by 1 second before retrying
                });
            } else {
                console.log(`Server started on port ${port}`);
            }
        });
    };

    tryStartServer();
}



// Start the server
const PORT = process.env.PORT || 8080;
startServer(PORT);

