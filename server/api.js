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

  getCommentsByUser,
  getCommentsByReviewID,
  createComment,
  updateComment, 
  deleteComment,

  hashPassword, 
  comparePasswords, 
  generateJWT, 
  verifyJWT 
} = require('./db');



module.exports = router;
