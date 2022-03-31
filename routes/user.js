const express = require('express');
const { userCaches } = require('../config/caches');
const router = express.Router();
const styleImages = require('../utils/styleImages');

router.get('/', async (req, res) => {
  if (!req.session.userID) return res.redirect('/');
  await userCaches[req.sessionID].fetchCompleted(req.session.userID);
  let levelCache = Object.values(userCaches[req.sessionID].completedLevels);
  res.render('user', { levelCache, req, styleImages });
});

router.post('/uncompleted/:id', async (req, res) => {
  try {
    let { userID } = req.session;
    let { id } = req.params;
    if (!userID) throw new Error('You need to be logged in to do this');
    if (!/^[A-Z0-9]{9}$/.test(id)) throw new Error('Invalid level id')
    await userCaches[req.sessionID].uncompleteLevel(id)
    res.redirect('/user');
  } catch (err) {
    // put toast here
    res.send(err.message)
    // res.render('levels', { levels: req.session.userData, req, styleImages, err});
  }
})

module.exports = router;
