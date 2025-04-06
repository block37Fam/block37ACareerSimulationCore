const express = require('express');
const router = express.Router();

const {
    getAllItems,
    getItemById
} = require('../db');

// API routes
//GET /api/items verified!
router.get('/', async(req, res, next) => {
    try {
        const response = await getAllItems()
        res.status(200).send(response)
    } catch (error) {
        next(error)
    }
})

//GET /api/items/:itemId verified!
router.get('/:itemId', async(req, res, next) => {
    try {
        const itemId = req.params.itemId
        const response = await getItemById(itemId)
        res.status(200).send(response)
    } catch (error) {
        next(error)
    }
})
module.exports = router;
