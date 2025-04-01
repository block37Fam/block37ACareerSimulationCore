const express = require('express');
const router = express.Router();

const {
    getUserById,
    getAuthenticatedUser
} = require('../db');

// API routes 
//GET /api/auth/me 🔒 unvertified yet!
router.get('/me', async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization; // Bearer <token>
      if (!authHeader) {
        return res.status(401).send({ error: 'Token required' });
      }
      const token = authHeader.replace('Bearer ', '');
      const user = await getAuthenticatedUser(token);
      res.send(user);
    } catch (err) {
      next(err);
    }
  });
  

module.exports = router;