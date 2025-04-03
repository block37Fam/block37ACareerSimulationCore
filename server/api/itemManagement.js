const express = require('express');
const router = express.Router();

const {
    getAllItems,
    getItemById
} = require('../db');

// API routes

module.exports = router;