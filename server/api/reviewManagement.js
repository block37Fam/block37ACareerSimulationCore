const express = require('express');
const router = express.Router();

const {
    getReviewsByItemId,
    getReviewById,
    createReview,
    deleteReview,
} = require('./db');

// API routes

module.exports = router;