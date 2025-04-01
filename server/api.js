const express = require('express');
const router = express.Router();

const {
  client, 
  registerUser,
  loginUser,
  getUserById,
  getAuthenticatedUser,

  getAllItems,
  getItemByID,

  getReviewsByItemId,
  getReviewById,
  createReview,
  deleteReview,
  getUserReviews,



  hashPassword, 
  comparePasswords, 
  generateJWT, 
  verifyJWT 
} = require('./db');

// API routes

module.exports = router;
