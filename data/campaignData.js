const pool = require('../database');

async function createCampaign(campaignDetails) {
    const {
        title,
        description,
        image_url = null,  // Optional
        target_amount,
        current_amount = 0.00,  // Default to 0.00
        start_date,
        end_date,
        campaign_status = 'active',  // Default to 'active'
        urgency_level = 'low',  // Default to 'low'
    } = campaignDetails;
    console.log("campaignDetails", campaignDetails)

    // If image_url is an array, join it into a single string
    const image_url_string = Array.isArray(image_url) ? image_url.join(', ') : image_url;

    // Convert start_date and end_date to the proper format for MySQL
    const formatted_start_date = new Date(start_date).toISOString().slice(0, 19).replace('T', ' ');
    const formatted_end_date = new Date(end_date).toISOString().slice(0, 19).replace('T', ' ');


    try {
        // Perform the database insert operation
        const [result] = await pool.query(
            `INSERT INTO campaigns 
            (title, description, image_url, target_amount, current_amount, start_date, end_date, campaign_status, urgency_level)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                title,
                description,
                image_url_string,
                target_amount,
                current_amount,
                formatted_start_date,
                formatted_end_date,
                campaign_status,
                urgency_level,
            ]
        );

        // Return the inserted campaign details (you can customize this based on your needs)
        return {
            campaign_id: result.insertId,  // Assuming `insertId` is returned from the insert query
            campaign_name: title,
            campaign_description: description,
            target_amount,
            image_url,
        };
    } catch (error) {
        console.error('Error creating campaign:', error.message);
        throw new Error('Failed to create campaign');
    }
}


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
    getCampaignById,
    createCampaign,
};
