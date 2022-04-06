const express = require('express');
const router = express.Router();
const clearLevel = require('../utils/clearLevel');
const ensureCache = require('../utils/ensureCache');
const fetchClears = require('../utils/fetchClears');
const styleImages = require('../utils/styleImages');


router.get('/', ensureCache, (req, res) => {
  let { levelCache } = req.session;
  res.render('levels', { levelCache, req, styleImages });
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
    res.send(err.message)
    // res.render('levels', { levels: req.session.userData, req, styleImages, err});
  }
})

module.exports = router;
