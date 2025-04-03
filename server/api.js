const express = require('express');
const router = express.Router();

// API routes
const logregRouter = require('./api/logregRoutes')
const userMangement = require('./api/userManagement')
router.use('/auth', logregRouter)
router.use('/auth', userMangement)


module.exports = router;
