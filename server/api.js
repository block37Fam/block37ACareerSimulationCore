const express = require('express');
const router = express.Router();

// API routes
const logregRouter = require('./api/logregRoutes')
const userMangement = require('./api/userManagement')
const itemManagement = require('./api/itemManagement')
const userReviewManagement = require('./api/userReviewManagement')
router.use('/auth', logregRouter)
router.use('/auth', userMangement)
router.use('/items', itemManagement)
router.use('/review', userReviewManagement)

module.exports = router;
