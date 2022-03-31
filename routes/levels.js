const express = require('express');
const router = express.Router();
const styleImages = require('../utils/styleImages');
const { userCaches, serverCache } = require('../config/caches');
const queryDB = require('../utils/queryDb');


router.get('/', async (req, res) => {
  let { levels } = userCaches[req.sessionID];
  res.render('levels', { levels, req, styleImages });
})

router.post('/completed/:id', async (req, res) => {
  try {
    let { userID } = req.session;
    let { id } = req.params;
    if (!userID) throw new Error('You need to be logged in to do this');
    if (!/^[A-Z0-9]{9}$/.test(id)) throw new Error('Invalid level id')
    let sqlData = {
      cleared_by: userID,
      id
    }
    let sql = `UPDATE levels SET cleared_by=:cleared_by, cleared_at=NOW() WHERE id=:id;`;
    await queryDB(sql, sqlData);
    userCaches[req.sessionID].removeLevel(id);
    serverCache.levels = []; // can probably just scan servercache for the level id and remove it from there too ??
    res.redirect('/');
  } catch (err) {
    // put toast here
    res.send(err.message)
    // res.render('levels', { levels: req.session.userData, req, styleImages, err});
  }
})



module.exports = router;
