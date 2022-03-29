const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  req.session.destroy();
  res.redirect('/levels');
});

module.exports = router;
