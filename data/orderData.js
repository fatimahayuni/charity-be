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
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Calculate the total order amount by summing the donation amounts for each item
        const total_donation_amount = orderItems.reduce((sum, item) => sum + item.donationAmount, 0);

        // Get the pledge_id from the first item (assuming all items have the same pledge_id)
        const pledgeId = orderItems[0].pledgeId;

        // Insert order data into the orders table, including pledge_id
        const [orderResult] = await connection.query(
            "INSERT INTO orders (user_id, total_donation_amount, pledge_id) VALUES (?, ?, ?)",
            [userId, total_donation_amount, pledgeId]
        );
        const orderId = orderResult.insertId;

        // Insert order items (donations to different campaigns) into the order_items table
        for (const item of orderItems) {
            await connection.query(
                'INSERT INTO order_items (order_id, campaign_id, pledge_id, donation_amount) VALUES (?, ?, ?, ?)',
                [orderId, item.campaignId, item.pledgeId, item.donationAmount]
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
        SELECT oi.donation_amount, c.campaign_id
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
async function updateOrderStatus(orderId, status) {
    try {
        const campaignService = require('../services/campaignService');

        const [result] = await pool.query(
            'UPDATE orders SET status = ? WHERE order_id = ?',
            [status, orderId]
        );

        if (status === 'completed') {

        }

        return result;

    } catch (error) {
        console.error(`Error updating order ${orderId}:`, error);
        throw new Error('Failed to update order status.');
    }
}

async function getOrderCampaignDetails(orderId) {
    try {
        // Query the order_items table to get the campaign_id and donation_amount
        const [orderItems] = await pool.query(
            'SELECT campaign_id, donation_amount FROM order_items WHERE order_id = ?',
            [orderId]
        );

        // Handle case if no items are found
        if (orderItems.length === 0) {
            throw new Error(`No order items found for orderId: ${orderId}`);
        }

        // Assuming there is only one item per order, if multiple items per order, adjust logic accordingly
        const { campaign_id, donation_amount } = orderItems[0];
        return { campaign_id, donation_amount };

    } catch (error) {
        console.error(`Error fetching campaign details for order ${orderId}:`, error);
        throw new Error('Failed to fetch campaign details.');
    }
}


async function insertDataIntoOrderCampaignsTable(orderId) {
    try {
        // Fetch campaign_id and donation_amount
        const { campaign_id, donation_amount } = await getOrderCampaignDetails(orderId);

        console.log(`Campaign details: campaignId = ${campaign_id}, donationAmount = ${donation_amount}`);
        // Query to fetch campaign_id and donation_amount from order_items table
        const query = `
        SELECT oi.campaign_id, oi.donation_amount
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.order_id
        WHERE o.order_id = ?;
        `;

        const [results] = await pool.query(query, [orderId]);
        console.log("[results]", results)

        if (results.length === 0) {
            throw new Error(`No order item found for order_id: ${orderId}`)
        }

        // Return the extracted campaign_id and donation_amount
        return results;

    } catch (error) {
        console.error('Error extracting data for order cmampaigns table', error);
        throw new Error('Failed to extract order data');

    }
}


// Update the checkout session ID in the order record (useful for tracking the payment session)
async function updateOrderSessionId(orderId, sessionId) {
    try {
        const [result] = await pool.query(
            'UPDATE orders SET checkout_session_id = ? WHERE order_id = ?',
            [sessionId, orderId]
        );

        return result;

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getOrdersByUserId,
    createOrder,
    getOrderDetails,
    updateOrderStatus,
    insertDataIntoOrderCampaignsTable,
    updateOrderSessionId,
    getOrderCampaignDetails
};
