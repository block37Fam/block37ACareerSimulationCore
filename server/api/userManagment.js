const express = require('express');
const router = express.Router();

const {
    getUserById,
    getAuthenticatedUser
} = require('./db');

// API routes

module.exports = router;