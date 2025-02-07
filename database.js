const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '127.0.0.1', // Hardcoded IPv4 address
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(connection => {
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
    });


module.exports = pool;