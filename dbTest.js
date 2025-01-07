const pool = require('./database');

async function testConnection() {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS result');
        console.log('Database connection successful:', rows);
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
}

testConnection();
