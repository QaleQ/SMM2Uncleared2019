const express = require('express');
const router = express.Router();
const styleImages = require('../utils/styleImages');
const { userCaches, serverCache } = require('../config/caches');


router.get('/', ensureCache, async (req, res) => {
  let levels = userCaches[req.sessionID] ? userCaches[req.sessionID].levels : serverCache.levels
  res.render('levels', { levels, req, styleImages });
})

router.post('/delete/:id', async (req, res) => {
  try {
    // if (!req.session.username) throw new Error('You need to be logged in to do this');
    if (!/^[0-9]+$/.test(req.params.id)) throw new Error('invalid level id')
    // let sql = `DELETE FROM levels WHERE id = :id`
    // await dbConnection.query(sql, req.params);

    res.send(`${req.params.id} deleted!`)
  } catch (err) {
    res.send(err.message)
    // res.render('levels', { levels: req.session.userData, req, styleImages, err});
  }
})

async function ensureCache (req, res, next) {
  if (serverCache.levels.length || 
    userCaches[req.sessionID]?.levels.length) return next();
  try {
    await serverCache.setLevels();
    return next();
  } catch {
    // unsure what to do if something goes wrong here ??
    // like, is it possible to pass the error message on to the next middleware?
    // or to halt the entire process and just render something from here?
  }
}

module.exports = router;
