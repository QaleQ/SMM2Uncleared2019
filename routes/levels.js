const express = require('express');
const router = express.Router();
const clearLevel = require('../utils/clearLevel');
const { ensureCache, readFlash } = require('../utils/middleware');
const fetchClears = require('../utils/fetchClears');


router.get('/', ensureCache, readFlash, (req, res) => {
  let { levelCache } = req.session;
  res.render('levels', { levelCache });
})

router.post('/cleared/:id', async (req, res) => {
  try {
    if (!req.session.clearsFetched) {
      req.session.clearsFetched = true;
      req.session = await fetchClears(req.session);
    }
    req.session = await clearLevel(req.params.id, req.session);
    res.redirect('/levels');
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/levels')
  }
})

module.exports = router;
