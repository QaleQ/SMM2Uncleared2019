const express = require('express');
const clearLevel = require('../utils/clearLevel');
const router = express.Router();
const { ensureCache, readFlash } = require('../utils/middleware');
const fetchClears = require('../utils/fetchClears');
const styleImages = require('../utils/styleImages');

router.get('/', ensureCache, readFlash, async (req, res) => {
  if (!req.session.userID) return res.redirect('/');
  
  if (!req.session.clearsFetched) {
    req.session.clearsFetched = true;
    req.session = await fetchClears(req.session);
  }
  
  let levelCache = [...req.session.clears].reverse();
  res.render('user', { levelCache, styleImages });
});

router.post('/uncleared/:id', ensureCache, async (req, res) => {
  try {
    if (!req.session.userID) throw new Error('You need to be logged in to do this');
    if (!/^[0-9]+$/.test(req.params.id)) throw new Error('Invalid level id')

    req.session = await clearLevel(req.params.id, req.session, false);
    res.redirect('/user');
  } catch (err) {
    req.flash('error', err.message)
    res.redirect('/user')
  }
})

module.exports = router;
