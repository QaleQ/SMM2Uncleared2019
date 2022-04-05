const express = require('express');
const serverCache = require('../config/caches');
const router = express.Router();
const ensureCache = require('../utils/ensureCache');
const queryDB = require('../utils/queryDb');
const styleImages = require('../utils/styleImages');

router.get('/', ensureCache, async (req, res) => {
  if (!req.session.userID) return res.redirect('/');

  if (!req.session.fetchOnce) {
    let sql = `SELECT * FROM levels WHERE cleared_by = :userID;`;
    let { sqlResult } = await queryDB(sql, req.session);
    sqlResult.map(level => {
      req.session.clears[level.id] = level;
    })
    req.session.fetchOnce = true;
  }
  
  let levelCache = Object.values(req.session.clears);
  res.render('user', { levelCache, req, styleImages });
});

router.post('/uncleared/:id', ensureCache, async (req, res) => {
  try {
    let { userID } = req.session;
    let { id } = req.params;

    if (!userID) throw new Error('You need to be logged in to do this');
    if (!/^[0-9]+$/.test(id)) throw new Error('Invalid level id')
    
    let sql = `UPDATE levels SET cleared_by = NULL, cleared_at = NULL WHERE id = :id;`;
    await queryDB(sql, req.params);

    req.session.levelCache[id] = Object.assign({}, req.session.clears[id]);
    delete req.session.clears[id];
    serverCache.clearedLevels.delete(id);
    serverCache.updateHash();

    res.redirect('/user');
  } catch (err) {
    // put toast here
    res.send(err.message)
    // res.render('levels', { levels: req.session.userData, req, styleImages, err});
  }
})

module.exports = router;
