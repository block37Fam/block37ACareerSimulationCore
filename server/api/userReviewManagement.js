const express = require('express');
const router = express.Router();
const requireUser = require('../middleware/requireUser')

const {
    getUserReviews
} = require('../db');

// API routes

//GET /api/reviews/me 🔒 unverified!

router.get('/me', requireUser, async(req, res, next) => {
    try {
        const user = req.user
        const userId = user.id
        const response = await getUserReviews(userId)
        res.status(200).send(response)
    } catch (error) {
        next(error)
    }
})


module.exports = router;