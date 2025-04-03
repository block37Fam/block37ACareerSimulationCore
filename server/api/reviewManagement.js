const express = require('express');
const router = express.Router();

const {
    getReviewsByItemId,
    getReviewById,
    createReview,
    deleteReview,
} = require('../db');

router.post('/', async (req, res, next) => {
    try {
      const { userId, itemId, rating, reviewText } = req.body;
  
      if (!userId || !itemId || !rating || !reviewText) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const newReview = await createReview(userId, itemId, rating, reviewText);
      res.status(201).send(newReview);
    } catch (err) {
      next(err);
    }
  });
module.exports = router;