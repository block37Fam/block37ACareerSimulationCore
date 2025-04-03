const express = require('express');
const router = express.Router();

const { getAuthenticatedUser } = require('../db');

// API routes 
//GET /api/auth/me 🔒 postman requset vertified
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