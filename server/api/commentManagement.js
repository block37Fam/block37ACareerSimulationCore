const express = require('express');
const router = express.Router();
const requireUser = require('../middleware/requireUser');

const {
  getCommentsByUser,
  getCommentsByReviewID,
  createComment,
  updateComment,
  deleteComment,
} = require('../db');

// API routes

//GET /api/comments/me  ---  Get all comments made by the logged-in user
router.get('/me', requireUser, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const comments = await getCommentsByUser(userId);
    res.status(200).send(comments);
  } catch (error) {
    next(error);
  }
});


// POST /api/items/:itemId/reviews/:reviewId/comments  --- Create a comment on a review
router.post('/items/:itemId/reviews/:reviewId/comments', requireUser, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const reviewId = req.params.reviewId;
    const { comment_text } = req.body;

      // Validate comment_text
      if (!comment_text || comment_text.trim() === '') {
        return res.status(400).send({ error: 'Comment text is required.' });
      }

    const newComment = await createComment(userId, reviewId, comment_text);
    res.status(201).send(newComment);
  } catch (error) {
    next(error);
  }
});


// GET /api/items/:itemId/reviews/:reviewId/comments  --- Get comments for a specific review
router.get('/items/:itemId/reviews/:reviewId/comments', async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId;
    const comments = await getCommentsByReviewID(reviewId);
    res.status(200).send(comments);
  } catch (error) {
    next(error);
  }
});


// PUT /api/users/:userId/comments/:commentId  --- Edit a comment
router.put('/users/:userId/comments/:commentId', requireUser, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { userId: paramUserId, commentId } = req.params;
    const { comment_text } = req.body;

    if (parseInt(userId) !== parseInt(paramUserId)) {
      return res.status(403).send({ error: "Unauthorized to edit this comment" });
    }

        // Validate comment_text
        if (!comment_text || comment_text.trim() === '') {
          return res.status(400).send({ error: 'Comment text is required.' });
        }

    const updatedComment = await updateComment(userId, commentId, comment_text);
    res.status(200).send(updatedComment);
  } catch (error) {
    next(error);
  }
});


// DELETE /api/users/:userId/comments/:commentId  ---  Delete a comment
router.delete('/users/:userId/comments/:commentId', requireUser, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { userId: paramUserId, commentId } = req.params;

    if (parseInt(userId) !== parseInt(paramUserId)) {
      return res.status(403).send({ error: "Unauthorized to delete this comment" });
    }
    await deleteComment(userId, commentId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});


module.exports = router;
