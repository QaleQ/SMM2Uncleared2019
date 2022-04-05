const express = require('express');
const router = express.Router();
const ensureCache = require('../utils/ensureCache');

router.get('/', ensureCache, (req, res) => {
  res.render('overview', { req });
})

module.exports = router;
