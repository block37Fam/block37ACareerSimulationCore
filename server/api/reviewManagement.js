const express = require('express');
const router = express.Router();

const {
    getReviewsByItemId,
    getReviewById,
    createReview,
    deleteReview,
} = require('../db');

// API routes

//GET /api/items/:itemId/reviews


//GET /api/items/:itemId/reviews/:reviewId


//POST /api/items/:itemId/reviews 🔒


//DELETE /api/users/:userId/reviews/:reviewId 🔒


module.exports = router;