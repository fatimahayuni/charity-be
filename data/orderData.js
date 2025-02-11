// imports the database connection pool which allows you to execute queries on the mysql db. the pool manages a set of refusable connections to the database. 
const pool = require('../database');


// Fetch past orders for a specific user
async function getOrdersByUserId(userId) {
    const [rows] = await pool.query(`
        SELECT o.*, oi.campaign_id 
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        WHERE o.user_id = ?;
    `, [userId]);

    return rows;
}

// Create a new order with donations to various campaigns
async function createOrder(userId, orderItems) {
    console.log("Creating order for user:", userId);

    console.log("begin connection")
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();;

        // Calculate the total order amount by summing the donation amounts for each item
        const total_donation_amount = orderItems.reduce((sum, item) => sum + item.donation_amount, 0);

        // Get the pledge_id from the first item (assuming all items have the same pledge_id)
        const pledgeId = orderItems[0].pledge_id;
        console.log("pledgeId: ", pledgeId)

        // Insert order data into the orders table, including pledge_id
        const [orderResult] = await connection.query(
            "INSERT INTO orders (user_id, total_donation_amount, pledge_id) VALUES (?, ?, ?)",
            [userId, total_donation_amount, pledgeId]
        );
        const orderId = orderResult.insertId;
        console.log("New Order ID:", orderId);


        // Insert order items (donations to different campaigns) into the order_items table
        for (const item of orderItems) {
            await connection.query(
                'INSERT INTO order_items (order_id, campaign_id, pledge_id, donation_amount) VALUES (?, ?, ?, ?)',
                [orderId, item.campaign_id, item.pledge_id, item.donation_amount]
            );
        }

        await connection.commit();

        return orderId;
    } catch (error) {
        await connection.rollback();
        console.error('Error creating order:', error);
        throw error;
    } finally {
        connection.release();
    }
}


async function getOrderDetails(orderId) {
    console.log(`Fetching order details for orderId: ${orderId}`);

    const [rows] = await pool.query(`
        SELECT oi.donation_amount, c.target_amount
        FROM order_items oi
        JOIN campaigns c ON oi.campaign_id = c.campaign_id
        WHERE oi.order_id = ?;
    `, [orderId]);


    if (rows.length === 0) {
        console.log('No order details found for orderId:', orderId); // Check if no results
    }


    return rows;
}

// Update the status of an order (e.g., from created to processing, etc.)
//todo haris said updateOrderStatus and updateOrderSessionId could be in one function. 
async function updateOrderStatus(orderId, status) {
    // Validate status before updating
    if (!['created', 'processing', 'completed', 'failed', 'cancelled'].includes(status)) {
        throw new Error('Invalid status');
    }
    await pool.query('UPDATE orders SET status = ? WHERE order_id = ?', [status, orderId]);
}

// Update the checkout session ID in the order record (useful for tracking the payment session)
async function updateOrderSessionId(orderId, sessionId) {
    console.log("Updating order session ID:", { orderId, sessionId });

    const [result] = await pool.query(
        'UPDATE orders SET checkout_session_id = ? WHERE order_id = ?',
        [sessionId, orderId]
    );


}

module.exports = {
    getOrdersByUserId,
    createOrder,
    getOrderDetails,
    updateOrderStatus,
    updateOrderSessionId
};
