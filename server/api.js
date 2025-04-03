const express = require('express');
const router = express.Router();

// API routes
const logregRouter = require('./api/logregRoutes')
const userMangement = require('./api/userManagement')
const commentRoutes = require('./api/commentManagement');
const reviewRoutes = require('./api/reviewManagement'); 
const itemRoutes = require('./api/itemManagement');

router.use('/auth', logregRouter)
router.use('/auth', userMangement)
router.use('/comments', commentRoutes); 
router.use('/reviews', reviewRoutes);
router.use('/items', itemRoutes);

module.exports = router;
