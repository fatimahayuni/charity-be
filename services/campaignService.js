const campaignData = require('../data/campaignData');
const orderData = require('../data/orderData');

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

async function insertDataIntoOrderCampaignsTable(orderId) {
    try {
        const orderDetailsArray = await orderData.getOrderDetails(orderId);
        console.log("1. Fetched order details:", orderDetailsArray);

        // Extract the first object from the array
        const orderDetails = orderDetailsArray[0];

        if (!orderDetails) {
            throw new Error(`No order details found for orderId ${orderId}`);
        }

        // Assign value
        let campaign_id = orderDetails.campaign_id;
        let donation_amount = orderDetails.donation_amount;

        if (campaign_id === undefined || donation_amount === undefined) {
            throw new Error(`Missing campaign_id or donation_amount for orderId ${orderId}`);
        }

        // Insert data into order_campaigns table (handled in campaignData.js)
        await campaignData.insertDataIntoOrderCampaignsTable(orderId, campaign_id, donation_amount);

        console.log(`2. Successfully inserted into order_campaigns for orderId ${orderId}`);

        // Update campaign's current_amount
        await campaignData.updateCampaignAmounts(campaign_id);
        console.log(`3. Updated campaign current_amount for campaign_id ${campaign_id}`);

    } catch (error) {
        console.error(`Error inserting data into order_campaigns table ${orderId}:`, error);
        throw new Error('Failed to insert data into order_campaigns table');
    }
}


module.exports = {
    getAllCampaigns,
    getCampaignById,
    createCampaign,
    insertDataIntoOrderCampaignsTable
};
