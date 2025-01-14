// This file sets up basci routes for retrieving cart contents, adding items to the cart, updating item quantities, and removing items from the cart. 

const pool = require('../database');


// Fetch cart contents for a user (i.e., view the campaigns they intend to donate to)
async function getCartContents(userId) {
    const [rows] = await pool.query(
        'SELECT c.id, c.campaign_id, cam.title AS campaign_title, cam.image_url AS image_url, c.donation_amount, c.added_at ' +
        'FROM cart_items c ' +
        'JOIN campaigns cam ON c.campaign_id = cam.campaign_id ' +
        'WHERE c.user_id = ?',
        [userId]
    );


    console.log("rows:", rows)

    return rows;
}

// Bulk update the cart contents (i.e., adding/removing donations to/from campaigns)
async function updateCart(userId, cartItems) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Clear existing cart items (donations) for the user
        await connection.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);

        // Insert each item in the new cart (each campaign the user wants to donate to)
        for (const item of cartItems) {
            await connection.query(
                'INSERT INTO cart_items (user_id, campaign_id, donation_amount, quantity) VALUES (?, ?, ?, ?)',
                [userId, item.campaign_id, item.donation_amount, item.quantity]
            );
        }

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = {
    getCartContents,
    updateCart
};
