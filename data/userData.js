const pool = require('../database');

async function getUserByEmail(email) {
    if (!email || typeof email !== 'string') {
        throw new Error('Invalid email');
    }
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
}

async function createUser({ email, password, user_type, first_name, last_name, created_at, updated_at }) {
    console.log("this is in userData.js:12");
    console.log({ email, password, user_type, first_name, last_name, created_at, updated_at });

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
        throw new Error('Invalid user data');
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Insert user data
        const [userResult] = await connection.query(
            `INSERT INTO users (email, password, user_type, first_name, last_name, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [email, password, user_type, first_name, last_name, created_at, updated_at]
        );

        const userId = userResult.insertId;

        // Commit the transaction
        await connection.commit();
        return { userId, email, user_type, first_name, last_name, created_at, updated_at };

    } catch (error) {
        // Rollback the transaction if something goes wrong
        await connection.rollback();
        throw error;
    } finally {
        // Release the connection
        connection.release();
    }
}

module.exports = {
    getUserByEmail,
    createUser,
};
