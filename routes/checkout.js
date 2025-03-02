const express = require('express');
const router = express.Router();
const orderService = require('../services/orderService');
const checkoutService = require('../services/checkoutService');
const UserAuth = require('../middleware/UserAuth');

// In-memory store for connected clients (you can replace it with a more persistent store if needed)
let clients = [];

// Function to notify all connected clients
function notifyClients(orderId, status) {
    clients.forEach(client =>
        client.write(`data: ${JSON.stringify({ orderId, status })}\n\n`)
    );
}

// SSE endpoint for checkout confirmation
router.get('/confirmation', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Add the client to the list of connected clients
    clients.push(res);

    // Remove client from list when connection is closed
    req.on('close', () => {
        clients = clients.filter(client => client !== res);
    });
});


// Route to handle order creation (ensure UserAuth is separate)
router.post('/', UserAuth, async (req, res) => {
    try {
        // Make sure `orderItems` is included in the request body
        const orderItems = req.body.orderItems;
        const orderId = await orderService.createOrder(req.user.userId, orderItems)

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: "Order items are required" });
        }

        const session = await checkoutService.checkout(req.user.userId, orderItems, orderId);
        res.json(session);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
