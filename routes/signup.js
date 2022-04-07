const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const login = require('../utils/login');
const queryDB = require('../utils/queryDb');
const { readFlash } = require('../utils/middleware');
const validateAuth = require('../utils/validateAuth');


router.route('/')
.get(readFlash, (req, res) => {
  if (req.session.loggedIn) res.redirect('/levels');
  res.render('authform', { action: 'signup', action_str: 'Sign up'});
})
.post(async (req, res) => {
  try {
    validateAuth(req.body, req.session);

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    let sql = `INSERT INTO users SET username = :username, password = :password`;
    await queryDB(sql, { username: req.body.username, password: hashedPassword });

    req.session = await login(req.body, req.session);

    res.redirect('/levels');
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/signup');
  }
});

module.exports = router;
