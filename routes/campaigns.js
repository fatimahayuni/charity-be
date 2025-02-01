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


// POST a new campaign
router.post('/', async (req, res) => {
    const {
        title,
        description,
        image_url,
        target_amount,
        current_amount,
        start_date,
        end_date,
        campaign_status,
        urgency_level
    } = req.body;

    try {
        // Call the service layer to handle database logic
        const newCampaign = await campaignService.createCampaign({
            title,
            description,
            image_url,
            target_amount,
            current_amount,
            start_date,
            end_date,
            campaign_status,
            urgency_level,
        });

        // Respond with the newly created campaign
        res.status(201).json({
            message: 'Campaign created successfully!',
            campaign: newCampaign,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create campaign', error: error.message });
    }
});

module.exports = router;
