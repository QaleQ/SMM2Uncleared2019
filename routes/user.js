const express = require('express');
const clearLevel = require('../utils/clearLevel');
const router = express.Router();
const ensureCache = require('../utils/ensureCache');
const fetchClears = require('../utils/fetchClears');
const styleImages = require('../utils/styleImages');

router.get('/', ensureCache, async (req, res) => {
  if (!req.session.userID) return res.redirect('/');
  
  if (!req.session.clearsFetched) {
    req.session.clearsFetched = true;
    req.session = await fetchClears(req.session);
  }
  
  let levelCache = [...req.session.clears].reverse();
  res.render('user', { levelCache, req, styleImages });
});

router.post('/uncleared/:id', ensureCache, async (req, res) => {
  try {
    if (!req.session.userID) throw new Error('You need to be logged in to do this');
    if (!/^[0-9]+$/.test(req.params.id)) throw new Error('Invalid level id')

    req.session = await clearLevel(req.params.id, req.session, false);
    res.redirect('/user');
  } catch (err) {
    res.send(err.message)
    // res.render('levels', { levels: req.session.userData, req, styleImages, err});
  }
})

module.exports = router;
