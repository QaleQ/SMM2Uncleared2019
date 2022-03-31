const express = require('express');
const router = express.Router();
const styleImages = require('../utils/styleImages');
const { userCaches, serverCache } = require('../config/caches');


router.get('/', async (req, res) => {
  let { levelCache } = userCaches[req.sessionID];
  res.render('levels', { levelCache, req, styleImages });
})

router.post('/completed/:id', async (req, res) => {
  try {
    let { userID } = req.session;
    let { id } = req.params;
    if (!userID) throw new Error('You need to be logged in to do this');
    if (!/^[A-Z0-9]{9}$/.test(id)) throw new Error('Invalid level id')
    await userCaches[req.sessionID].completeLevel(id, userID)
    res.redirect('/');
  } catch (err) {
    // put toast here
    res.send(err.message)
    // res.render('levels', { levels: req.session.userData, req, styleImages, err});
  }
})



module.exports = router;
