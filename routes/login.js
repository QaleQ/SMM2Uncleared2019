const express = require('express');
const router = express.Router();
const login = require('../utils/login');
const readFlash = require('../utils/readFlash');


router.route('/')
.get(readFlash, (req, res) => {
  if (req.session.username) res.redirect('/levels');
  res.render('login');
})
.post(async (req, res) => {
  try {
    req.session = await login(req.body, req.session);
    res.redirect('/levels');
  } catch (err) {
    req.flash('error', 'Something went wrong!')
    res.redirect('/login');
  }
});


module.exports = router;
