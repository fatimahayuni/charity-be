const express = require('express');
const router = express.Router();
const orderService = require('../services/orderService'); // Assuming this exists to handle order data

// Get order by orderId
router.get('/:orderId', async (req, res) => {
    try {
        // Call the service to get order details
        const order = await orderService.getOrderDetails(req.params.orderId);

        // Log the order data to check what is returned
        console.log('Order Data:', order);

        // Check if order exists and send it as a response
        if (order) {
            res.json(order); // Return order data, including campaign progress
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
