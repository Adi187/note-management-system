const express = require('express');
const router = express.Router();
const { Note, User } = require('../models');

// Middleware to authenticate the user (assuming you have session or JWT setup)
function authenticate(req, res, next) {
  console.log('Session:', req.session); // Check session object
  console.log('User ID in Session:', req.session.userId); // Check user ID in session

  if (req.session && req.session.userId) {
    User.findByPk(req.session.userId)
      .then(user => {
        console.log('Fetched User:', user); // Check fetched user
        if (user) {
          req.user = user;
          next();
        } else {
          res.status(401).json({ error: 'User not found' });
        }
      })
      .catch(error => {
        res.status(500).json({ error: error.message });
      });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
}

router.post('/create', authenticate, async (req, res) => {
  const { title, content } = req.body;
  console.log(req.user)
  // Assume user ID is obtained from authenticated session
  const userId = req.user.id;

  try {
    const note = await Note.create({ title, content, UserId: userId });
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/display', authenticate, async (req, res) => {
  try {
    const notes = await Note.findAll({ where: { UserId: req.user.id } });
    res.json(notes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
