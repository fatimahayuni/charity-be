// make use of orderService and stripeService to check out a shopping cart
const cartService = require('./cartService');
const orderService = require('./orderService');
const stripeService = require('./stripeService');

async function checkout(userId, orderItems) {
    console.log("Entering checkoutService.js");
    console.log("User ID:", userId);
    console.log("Order Items from Frontend:", orderItems);
    try {
        // Step 1: Get the content of the user's shopping cart
        const cartItems = await cartService.getCartContents(userId);
        // Log the result of cart retrieval
        console.log('Cart Items in checkoutService.js:', cartItems);

        // Ensure cartItems is not empty
        if (!cartItems || cartItems.length === 0) {
            throw new Error('Shopping cart is empty');
        }

        // create the order first and save into the db
        const orderId = await orderService.createOrder(userId, cartItems);
        console.log('Order ID:', orderId);

        // create the checkout session using the order details
        const session = await stripeService.createCheckoutSession(userId, cartItems, orderId);
        console.log('Stripe Session:', session);

        // save the session id into the order
        await orderService.updateOrderSessionId(orderId, session.id);
        console.log('Session ID saved to order:', session.id);

        return session;
    } catch (error) {
        console.error('Checkout Error:', error.message);
        throw error; // Re-throw error to be handled by the route
    }
}


module.exports = {
    checkout
};