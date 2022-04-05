const express = require('express');
const router = express.Router();
const login = require('../utils/login');

router.route('/')
.get((req, res) => {
  if (req.session.username) res.redirect('/');
  res.render('login');
})
.post(async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username.length) throw new Error('Username required');
    if (!password.length) throw new Error('Password required');
    if (req.session.username) throw new Error(`Already signed in as ${req.session.username}`);

    let loginResult = await login(username, password);
    
    req.session.userID = loginResult.id;
    req.session.username = loginResult.username;
    req.session.clears = {};

    res.redirect('/levels');
  } catch (err) {
    res.render('login', { err });
  }
});


module.exports = router;
