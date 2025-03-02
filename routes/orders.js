const express = require('express');
const router = express.Router();
const orderService = require('../services/orderService');
const campaignService = require('../services/campaignService'); // Assuming this service exists

// Get order by orderId
router.get('/:orderId', async (req, res) => {
    try {
        // Call the service to get order details
        const order = await orderService.getOrderDetails(req.params.orderId);

        // Check if order exists and send it as a response
        if (order) {
            // If the order is completed and involves a donation, update the campaign amounts
            if (order.status === 'completed') {
                await campaignService.updateCampaignAmounts();
                console.log('Campaign amounts updated successfully after completing the order.');
            }
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
