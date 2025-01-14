const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);


    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error("Token verification failed:", err.message); // Log the specific error
            return res.sendStatus(403); // Invalid or expired token
        }
        req.user = user; // Token is valid, attach the user to the request

        next();
    });
}

module.exports = authenticateToken;