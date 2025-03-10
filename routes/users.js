const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const jwt = require('jsonwebtoken');

// Helper function to format date to MySQL-compatible format
function formatDateToMySQL(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// POST register a new user
router.post('/register', async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            salutation,
            marketingPreferences,
            country,
            userType
        } = req.body;
        console.log("req.body", req.body);

        // Get the current date and time for created_at and updated_at
        const currentDate = new Date();
        const formattedDate = formatDateToMySQL(currentDate);

        // Mapping camelCase to snake_case
        const userData = {
            first_name: firstName,
            last_name: lastName,
            email,
            password,
            salutation,
            marketing_preferences: marketingPreferences,
            country,
            user_type: userType,
            created_at: formattedDate,
            updated_at: formattedDate
        };

        console.log("Mapped userData", userData);

        // Register user with the new payload structure
        const userId = await userService.registerUser(userData);


        res.status(201).json({ message: "User registered successfully", userId });
    } catch (error) {
        console.error("Error registering user:", error); // Log the full error for better debugging
        res.status(400).json({ message: error.message });
    }
});

// POST login a user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userService.loginUser(email, password);

        const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Store the token in an HTTP-only cookie
        res.cookie("jwt", token, {
            httpOnly: true,  // Makes the cookie inaccessible to JavaScript (important for security)
            secure: true,
            sameSite: "Lax",  // Protects against CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000,  // Cookie expiration (7 days)
        });

        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});

// ✅ Check if user is authenticated (auth status)
// router.get('/auth-status', (req, res) => {
//     const token = req.cookies.jwt; // Retrieve JWT from cookies

//     if (!token) {
//         return res.json({ isAuthenticated: false });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) {
//             return res.json({ isAuthenticated: false });
//         }

//         res.json({ isAuthenticated: true, user });
//     });
// });

// ✅ Logout route to clear JWT cookie
router.post('/logout', (req, res) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
    });
    res.json({ message: 'Logged out successfully' });
});


module.exports = router;