const campaignData = require('../data/campaignData');


async function getAllCampaigns() {
    console.log("campaignService.js");
    return await campaignData.getAllCampaigns();
}

async function getCampaignById(id) {
    const campaign = await campaignData.getCampaignById(id);
    if (!campaign) {
        throw new Error('Campaign not found');
    }
    // todo: check for campaign status, goal progress, expiration, etc.
    return campaign;
}

module.exports = {
    getAllCampaigns,
    getCampaignById
};
