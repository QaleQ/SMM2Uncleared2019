const express = require('express');
const router = express.Router();
const login = require('../utils/login');

router.route('/')
  if (req.session.username) res.redirect('/levels');
  res.render('login');
})
.post(async (req, res) => {
  try {
    req.session = await login(req.body, req.session);
    res.redirect('/levels');
  } catch (err) {
    res.render('login', { err });
  }
});


module.exports = router;
