const pool = require('../database');

async function getUserByEmail(email) {
    if (!email || typeof email !== 'string') {
        throw new Error('Invalid email');
    }
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
}

async function createUser({ username, email, password, role, first_name, last_name, created_at, updated_at }) {
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
        throw new Error('Invalid user data');
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Insert user data
        const [userResult] = await connection.query(
            `INSERT INTO users (username, email, password, role, first_name, last_name, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [username, email, password, role, first_name, last_name, created_at, updated_at]
        );

        const userId = userResult.insertId;

        // Commit the transaction
        await connection.commit();
        return { userId, username, email, role, first_name, last_name, created_at, updated_at };

    } catch (error) {
        // Rollback the transaction if something goes wrong
        await connection.rollback();
        throw error;
    } finally {
        // Release the connection
        connection.release();
    }
}
