// This layer will hadle the business logic for cart operations, such as validating inputs and enforcing any business roles. 

const cartData = require('../data/cartData');

/*
Fetches all cart contents for a specific user.
@param {number} userId - ID of the user.
@returns {Promise<Array>} - List of cart items with product details. 
*/

async function getCartContents(userId) {
    try {
        const cartContents = await cartData.getCartContents(userId);

        // Log the cart contents for debugging
        console.log("Fetched Cart Contents:", cartContents);

        return cartContents;

    } catch (error) {
        console.error("Error fetching cart contents:", error.message);
        throw error; // Re-throwing to propagate to the route
    }
}

/*
Updates the cart with a new set of items.
This function performs a bulk update, replacing the cart contents with the provided items. 
@param {number} userId - ID of the user
@param {Array} cartItems - Array of items to update in the cart
*/
async function updateCart(userId, cartItems) {
    if (!Array.isArray(cartItems)) {
        throw new Error('Cart items must be an array');
    }
    await cartData.updateCart(userId, cartItems);
}

module.exports = {
    getCartContents,
    updateCart // Only bulk update is needed now
}