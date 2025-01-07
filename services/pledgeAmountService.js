const express = require('express');
const router = express.Router();
const { Campaign } = require('../models'); // Import the Campaign model

// GET all campaigns
router.get('/', async (req, res) => {
    try {
        const campaigns = await Campaign.findAll(); // Fetch all campaigns
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve campaigns', error: error.message });
    }
});

// GET a single campaign
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const campaign = await Campaign.findByPk(id); // Find a campaign by primary key
        if (!campaign) {
            return res.status(404).json({ message: `Campaign with id ${id} not found` });
        }
        res.json(campaign);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve campaign', error: error.message });
    }
});

module.exports = router;
