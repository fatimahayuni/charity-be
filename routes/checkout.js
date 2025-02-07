const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const orderService = require('../services/orderService');
const checkoutService = require('../services/checkoutService');
const campaignService = require('../services/campaignService');
const UserAuth = require('../middleware/UserAuth');


// Webhook for Stripe - Make sure express.raw is first. 
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    let event;
    try {

        // verify the webhook signature
        const sig = req.headers['stripe-signature'];
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        console.error(`Webhook Error: ${error.message}`);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    // Handling the webhook event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // Check if payment was successful
        if (session.payment_status === 'paid') {
            try {
                const orderId = session.metadata.order_id; // Ensure you pass order_id as metadata
                await orderService.updateOrderStatus(orderId, 'completed');
            } catch (error) {
                console.error('Error updating order status:', error);
            }
        } else {
            console.log(`Payment not yet completed for session ${session.id}`);
        }
    } else {
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
});

// Route to handle order creation (ensure UserAuth is separate)
router.post('/', UserAuth, async (req, res) => {
    try {
        // Make sure `orderItems` is included in the request body
        const orderItems = req.body;
        console.log("Request Body:", req.body); // Log entire body for debugging

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: "Order items are required" });
        }

        const session = await checkoutService.checkout(req.user.userId, orderItems);
        res.json(session);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
