const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();
const orderService = require('../services/orderService')

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {

    // let event;

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
                const orderId = session.metadata.order_id;
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

module.exports = router;
