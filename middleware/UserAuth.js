const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    // const authHeader = req.headers['authorization'];
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error("Token verification failed:", err.message); // Log the specific error
            return res.sendStatus(403); // Invalid or expired token
        }
        req.user = user

        next();
    });
}

module.exports = authenticateToken;