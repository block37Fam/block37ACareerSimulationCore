const express = require('express');
const router = express.Router();

const {
    getAllItems,
    getItemByID
} = require('./db');

// API routes

module.exports = router;