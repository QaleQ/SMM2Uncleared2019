const express = require('express');
const router = express.Router();
const login = require('../utils/login');
const { readFlash } = require('../utils/middleware');
const validateAuth = require('../utils/validateAuth');


router.route('/')
.get(readFlash, (req, res) => {
  if (req.session.loggedIn) res.redirect('/levels');
  res.render('authform', { action: 'login', action_str: 'Log in'});
})
.post(async (req, res) => {
  try {
    validateAuth(req.body, req.session);
    req.session = await login(req.body, req.session);
    res.redirect('/levels');
  } catch (err) {
    req.flash('error', err.message)
    res.redirect('/login');
  }
});


module.exports = router;
