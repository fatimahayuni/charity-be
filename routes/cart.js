const express = require('express');
const router = express.Router();
const cartService = require('../services/cartService');
const authenticateToken = require('../middleware/UserAuth')

// Apply the authenticateToken middleware to all routes
router.use(authenticateToken);

// GET cart contents
router.get('/', async (req, res) => {
    console.log("1. cart.js: Received GET request to fetch cart contents");

    try {
        const cartContents = await cartService.getCartContents(req.user.userId);
        console.log("cart.js: cartContents ", cartContents)
        res.json(cartContents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT bulk update cart
router.put('/', async (req, res) => {
    try {
        const cartItems = req.body.cartItems;
        await cartService.updateCart(req.user.userId, cartItems);
        res.json({ message: 'Cart updated successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;