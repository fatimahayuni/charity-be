// make use of orderService and stripeService to check out a shopping cart
const cartService = require('./cartService');
const orderService = require('./orderService');
const stripeService = require('./stripeService');

async function checkout(userId) {
    // get the content of the user's shopping cart
    const cartItems = await cartService.getCartContents(userId);
    // create the order first and save into the db
    const orderId = await orderService.createOrder(userId, cartItems);
    // create the session
    const session = await stripeService.createCheckoutSession(userId, orderItems, orderId);
    // save the session id into the order
    await orderService.updateOrderSessionId(orderId, session.id);

    return session;
}

module.exports = {
    checkout
};