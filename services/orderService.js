const orderData = require('../data/orderData');

/**
 * Retrieves all orders associated with a specific user ID.
 * @param {string} userId - The ID of the user whose orders are being retrieved.
 * @returns {Promise<Array>} - A list of orders for the given user.
 */
async function getOrdersByUserId(userId) {
    try {
        return await orderData.getOrdersByUserId(userId);
    } catch (error) {
        console.error(`Error fetching orders for userId ${userId}:`, error);
        throw new Error('Failed to fetch orders.');
    }
}

/**
 * Creates a new order for a specific user.
 * @param {string} userId - The ID of the user placing the order.
 * @param {Array} orderItems - The items included in the order.
 * @returns {Promise<Object>} - The newly created order.
 */
async function createOrder(userId, orderItems) {
    try {
        return await orderData.createOrder(userId, orderItems);
    } catch (error) {
        console.error(`Error creating order for userId ${userId}:`, error);
        throw new Error('Failed to create order.');
    }
}

/**
 * Updates the Stripe session ID for a specific order.
 * @param {string} orderId - The ID of the order to update.
 * @param {string} sessionId - The Stripe session ID to associate with the order.
 * @returns {Promise<void>} - Confirmation of the update.
 */
async function updateOrderSessionId(orderId, sessionId) {
    console.log("orderId before try block", orderId) //todo problem starts here
    try {
        return await orderData.updateOrderSessionId(orderId, sessionId);
    } catch (error) {
        console.error(`Error updating sessionId for orderId ${orderId}:`, error);
        throw new Error('Failed to update session ID.');
    }
}

/**
 * Retrieves the details of a specific order.
 * @param {string} orderId - The ID of the order to retrieve.
 * @returns {Promise<Object>} - The details of the order.
 */
async function getOrderDetails(orderId) {
    try {
        return await orderData.getOrderDetails(orderId);
    } catch (error) {
        console.error(`Error fetching order details for orderId ${orderId}:`, error);
        throw new Error('Failed to fetch order details.');
    }
}

/**
 * Updates the status of a specific order.
 * @param {string} orderId - The ID of the order to update.
 * @param {string} status - The new status of the order (e.g., 'pending', 'completed').
 * @returns {Promise<void>} - Confirmation of the update.
 */
async function updateOrderStatus(orderId, status) {
    try {
        return await orderData.updateOrderStatus(orderId, status);
    } catch (error) {
        console.error(`Error updating status for orderId ${orderId}:`, error);
        throw new Error('Failed to update order status.');
    }
}

async function getOrderById(orderId) {
    try {
        return await orderData.getOrderDetails(orderId);  // Assuming this fetches the order by ID
    } catch (error) {
        console.error(`Error fetching order details for orderId ${orderId}:`, error);
        throw new Error('Failed to fetch order details.');
    }
}

module.exports = {
    getOrdersByUserId,
    createOrder,
    updateOrderSessionId,
    getOrderDetails,
    updateOrderStatus,
    getOrderById
};
