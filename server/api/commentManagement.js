const express = require('express');
const router = express.Router();

const {
  getCommentsByUser,
  getCommentsByReviewID,
  createComment,
  updateComment,
  deleteComment,
} = require('../db');


router.get('/user/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const comments = await getCommentsByUser(userId);
    res.status(200).send(comments);
  } catch (err) {
    next(err);
  }
});

router.get('/review/:reviewId', async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const comments = await getCommentsByReviewID(reviewId);
    res.status(200).send(comments);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { userId, reviewId, commentText } = req.body;

    if (!userId || !reviewId || !commentText) {
      return res.status(400).json({ error: 'Missing required fields: userId, reviewId, or commentText' });
    }

    const newComment = await createComment(userId, reviewId, commentText);
    res.status(201).send(newComment);
  } catch (err) {
    next(err);
  }
});


router.put('/:commentId', async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { userId, commentText } = req.body;

    if (!userId || !commentText) {
      return res.status(400).json({ error: 'Missing userId or commentText' });
    }

    const updated = await updateComment(userId, commentId, commentText);
    res.status(200).send(updated);
  } catch (err) {
    next(err);
  }
});


router.delete('/:commentId', async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    await deleteComment(userId, commentId);
    res.status(200).send({ message: 'Comment deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
