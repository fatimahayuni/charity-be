// make use of orderService and stripeService to check out a shopping cart
const cartService = require('./cartService');
const orderService = require('./orderService');
const orderData = require('../data/orderData')
const stripeService = require('./stripeService');

async function checkout(userId, orderItems, orderId) {
    try {
        // Step 1: Get the content of the user's shopping cart
        const cartItems = await cartService.getCartContents(userId);

        // Ensure cartItems is not empty
        if (!cartItems || cartItems.length === 0) {
            throw new Error('Shopping cart is empty');
        }

        // Extract campaignId from orderItems (assuming it's the same for all items)
        const campaignId = cartItems[0].campaign_id;

        // create the checkout session using the order details
        const session = await stripeService.createCheckoutSession(userId, orderItems, campaignId, orderId);

        // save the session id into the order
        await orderData.updateOrderSessionId(orderId, session.id);

        return session;
    } catch (error) {
        console.error('Checkout Error:', error.message);
        throw error;
    }
}

module.exports = {
    checkout
};