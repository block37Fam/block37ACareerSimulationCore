const express = require('express');
const router = express.Router();

const {
    hashPassword, 
    comparePasswords, 
    generateJWT, 
    verifyJWT 
} = require('../db');

// API routes

module.exports = router;