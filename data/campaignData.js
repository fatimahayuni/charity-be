const pool = require('../database');

async function getAllCampaigns() {
    const [rows] = await pool.query('SELECT id, name, description, target_amount, image FROM campaigns');
    return rows;
}

async function getCampaignById(id) {
    const [rows] = await pool.query('SELECT * FROM campaigns WHERE id = ?', [id]);
    return rows[0];
}

module.exports = {
    getAllCampaigns,
    getCampaignById
};
