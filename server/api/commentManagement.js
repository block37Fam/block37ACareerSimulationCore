const express = require('express');
const router = express.Router();

const {
  getCommentsByUser,
  getCommentsByReviewID,
  createComment,
  updateComment, 
  deleteComment,
} = require('./db');

// API routes

module.exports = router;