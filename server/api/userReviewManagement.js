const express = require('express');
const router = express.Router();
const requireUser = require('../middleware/requireUser');


const {
    getUserReviews
} = require('../db');

// API routes

//GET /api/reviews/me 🔒 unverified!

router.get('/me', async(req, res, next) => {
    try {
        const authHeader = req.headers.authorization; // Bearer <token>
        if (!authHeader) {
        return res.status(401).send({ error: 'Token required' });
        }
        const token = authHeader.replace('Bearer ', '');
        const user = await getAuthenticatedUser(token);
        const userId = user.id
        const response = await getUserReviews(userId)
        res.status(200).send(response)
    } catch (error) {
        next(error)
    }
})


module.exports = router;