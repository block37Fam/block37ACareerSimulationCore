const express = require('express');
const router = express.Router();

// API routes
const logregRouter = require('./api/logregRoutes')
const userMangement = require('./api/userManagement')
const itemManagement = require('./api/itemManagement')
router.use('/auth', logregRouter)
router.use('/auth', userMangement)
router.use('items', itemManagement)


module.exports = router;
