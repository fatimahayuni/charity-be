const campaignData = require('../data/campaignData');

async function getAllCampaigns() {

    // Fetch campaigns
    const campaigns = await campaignData.getAllCampaigns();

    // Return the campaigns
    return campaigns;
}

async function getCampaignById(id) {
    const campaign = await campaignData.getCampaignById(id);
    if (!campaign) {
        throw new Error('Campaign not found');
    }
    // todo: check for campaign status, goal progress, expiration, etc.
    return campaign;
}

async function createCampaign(campaignDetails) {
    try {
        const newCampaign = await campaignData.createCampaign(campaignDetails);
        return newCampaign;
    } catch (error) {
        console.error('Error creating campaign:', error);
        throw new Error('Failed to create campaign');
    }
}

module.exports = {
    getAllCampaigns,
    getCampaignById,
    createCampaign
};
