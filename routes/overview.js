const express = require('express');
const router = express.Router();
const { ensureCache } = require('../utils/middleware');

router.get('/', ensureCache, (req, res) => {
  res.render('overview');
})

module.exports = router;
