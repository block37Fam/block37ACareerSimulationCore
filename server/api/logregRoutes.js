const express = require('express');
const router = express.Router();

const {
  client, 
  registerUser,
  loginUser 
} = require('./db');

// API routes

module.exports = router;