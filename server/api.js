const express = require('express');
const router = express.Router();

// API routes
const logregRouter = require('./api/logregRoutes')
const userManagement = require('./api/userManagement')
const itemManagement = require('./api/itemManagement')
const reviewManagement = require('./api/reviewManagement')

router.use('/auth', logregRouter)
router.use('/auth', userManagement)
router.use('/items', itemManagement)
router.use('/reviews', reviewManagement)

module.exports = router;
