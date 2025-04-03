const express = require('express');
const router = express.Router();
const requireUser = require('../middleware/requireUser');


const {
    getUserReviews
} = require('../db');

// API routes

router.get('/me', requireUser, async (req, res, next) => {
    
 });


module.exports = router;