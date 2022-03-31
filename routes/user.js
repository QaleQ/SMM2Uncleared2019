const express = require('express');
const queryDB = require('../utils/queryDb');
const router = express.Router();

router.get('/', (req, res) => {
  if (!req.session.userID) res.redirect('/');
  // check if there are levels in cache
    // fetch if not (but only once per cache hash, might not have cleared any levels)
  
  res.render('user', { req });
});

module.exports = router;
