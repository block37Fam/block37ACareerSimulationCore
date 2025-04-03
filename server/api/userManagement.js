const express = require('express');
const router = express.Router();
const requireUser = require('../middleware/requireUser');

// API routes 
//GET /api/auth/me 🔒 postman requset vertified
router.get('/me', requireUser, async (req, res, next) => {
    try {
      const user = req.user;
      res.send(user);
    } catch (err) {
      next(err);
    }
  });
  

module.exports = router;