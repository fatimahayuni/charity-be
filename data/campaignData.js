const pool = require('../database');

async function getAllCampaigns() {
    try {
        const [rows] = await pool.query('SELECT campaign_id, title, description, target_amount, image_url FROM campaigns');

        // Map the rows to convert snake_case to camelCase
        return rows.map(campaign => ({
            campaign_id: campaign.campaign_id,
            campaign_name: campaign.title,
            campaign_description: campaign.description,
            target_amount: campaign.target_amount,
            image_url: campaign.image_url,  // Convert snake_case to camelCase
        }));
    } catch (error) {
        console.error('Error fetching all campaigns:', error.message);
        throw new Error('Failed to fetch campaigns');  // Throw a more general error
    }
}

async function getCampaignById(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM campaigns WHERE campaign_id = ?', [id]);
        if (rows.length === 0) {
            throw new Error('Campaign not found');
        }

        // Map the row to convert snake_case to camelCase
        const campaign = rows[0];
        return {
            campaign_id: campaign.campaign_id,
            campaign_name: campaign.title,
            campaign_description: campaign.description,
            target_amount: campaign.target_amount,
            imageUrl: campaign.image_url,  // Convert snake_case to camelCase
        };
    } catch (error) {
        console.error('Error fetching campaign by ID:', error.message);
        throw error;  // Re-throw the error so that it can be caught by the calling function
    }
}

module.exports = {
    getAllCampaigns,
    getCampaignById
};
