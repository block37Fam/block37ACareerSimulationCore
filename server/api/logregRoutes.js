const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser
} = require('../db');


router.post('/register', async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const newUser = await registerUser({ username, email, password });
      res.status(201).send(newUser);
    } catch (err) {
      next(err);
    }
});
  

router.post('/login', async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await loginUser({email, password});
      res.send(user);
    } catch (err) {
      next(err);
    }
});
  

module.exports = router;