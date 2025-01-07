const express = require('express');
const router = express.Router();
const campaignService = require('../services/campaignService');

// GET all campaigns
router.get('/', async (req, res) => {
    try {
        const campaigns = await campaignService.getAllCampaigns();
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

// GET a single campaign
router.get('/:id', async (req, res) => {
    try {
        const campaign = await campaignService.getCampaignById(req.params.id);
        res.json(campaign)
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports = router;
