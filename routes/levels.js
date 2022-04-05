const express = require('express');
const router = express.Router();
const serverCache = require('../config/caches');
const ensureCache = require('../utils/ensureCache');
const queryDB = require('../utils/queryDb');
const styleImages = require('../utils/styleImages');


router.get('/', ensureCache, async (req, res) => {
  console.log(serverCache.numLevels)
  let { levelCache } = req.session;
  res.render('levels', { levelCache, req, styleImages });
})

router.post('/cleared/:id', async (req, res) => {
  try {
    let { userID } = req.session;
    let { id } = req.params;

    if (!userID) throw new Error('You need to be logged in to do this');
    if (!/^[0-9]+$/.test(id)) throw new Error('Invalid level id')

    let sqlData = { id, userID }
    let sql = `UPDATE levels SET cleared_by = :userID, cleared_at = NOW() WHERE id = :id;`;
    await queryDB(sql, sqlData);

    req.session.clears[id] = Object.assign({}, req.session.levelCache[id]);
    delete req.session.levelCache[id];
    delete serverCache.levelCache[id];
    serverCache.clearedLevels.add(id);
    serverCache.updateHash();

    res.redirect('/');
  } catch (err) {
    // put toast here
    res.send(err.message)
    // res.render('levels', { levels: req.session.userData, req, styleImages, err});
  }
})



module.exports = router;
