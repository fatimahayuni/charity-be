// imports the database connection pool which allows you to execute queries on the mysql db. the pool manages a set of refusable connections to the database. 
const pool = require('../database');

// Fetch past orders for a specific user
async function getOrdersByUserId(userId) {
    const [rows] = await pool.query('SELECT * FROM orders WHERE user_id = ?', [userId]);
    console.log(rows);
    return rows;
}

// Create a new order with donations to various campaigns
async function createOrder(userId, orderItems) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Calculate the total order amount by summing the donation amounts for each item
        const total = orderItems.reduce((sum, item) => sum + item.item_amount, 0);

        // Insert order data into the orders table
        const [orderResult] = await connection.query(
            "INSERT INTO orders (user_id, total) VALUES (?, ?)",
            [userId, total]
        );
        const orderId = orderResult.insertId;

        // Insert order items (donations to different campaigns) into the order_items table
        for (const item of orderItems) {
            await connection.query(
                'INSERT INTO order_items (order_id, campaign_id, pledge_id, item_amount) VALUES (?, ?, ?, ?)',
                [orderId, item.campaign_id, item.pledge_id, item.item_amount]
            );
        }

        await connection.commit();
        return orderId;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

// Fetch detailed information about a specific order (including campaign and pledge details)
async function getOrderDetails(orderId) {
    const [rows] = await pool.query(`
        SELECT
            oi.campaign_id,
            c.title AS campaign_title,
            p.amount AS pledge_amount,
            oi.item_amount,
        FROM order_items oi
        JOIN campaigns c ON oi.campaign_id = c.campaign_id
        JOIN pledge_amounts p ON oi.pledge_id = p.pledge_id
        WHERE oi.order_id = ?
    `, [orderId]);

    return rows;
}

// Update the status of an order (e.g., from created to processing, etc.)
async function updateOrderStatus(orderId, status) {
    // Validate status before updating
    if (!['created', 'processing', 'completed', 'failed', 'cancelled'].includes(status)) {
        throw new Error('Invalid status');
    }
    await pool.query('UPDATE orders SET status = ? WHERE order_id = ?', [status, orderId]);
}

// Update the checkout session ID in the order record (useful for tracking the payment session)
async function updateOrderSessionId(orderId, sessionId) {
    await pool.query('UPDATE orders SET checkout_session_id = ? WHERE order_id = ?', [sessionId, orderId]);
}

module.exports = {
    getOrdersByUserId,
    createOrder,
    getOrderDetails,
    updateOrderStatus,
    updateOrderSessionId
};
