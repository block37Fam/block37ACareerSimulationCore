const express = require('express');
const router = express.Router();

const {
  getCommentsByUser,
  getCommentsByReviewID,
  createComment,
  updateComment, 
  deleteComment,
} = require('../db');

// API routes

//GET /api/comments/me 🔒



//POST /api/items/:itemId/reviews/:reviewId/comments 🔒


//PUT /api/users/:userId/comments/:commentId 🔒


//DELETE /api/users/:userId/comments/:commentId 🔒


module.exports = router;