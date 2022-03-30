const express = require('express');
const router = express.Router();
const dbConnection = require('../config/dbConnection');
const { userCaches, serverCache } = require('../config/caches');
const queryDB = require('../utils/queryDb');
const Cache = require('../models/cache');
const buildFilterString = require('../utils/buildFilterString');

router.route('/')
.get((req, res) => {
  res.render('filter', { req });
})
.post(async (req, res) => {
  try {
    let sql = buildFilterString(req.body);
    let sqlResult = await queryDB(sql, req.body);
    if (!sqlResult.length) throw new Error ('No results!')

    if (!userCaches[req.sessionID]) userCaches[req.sessionID] = new Cache(serverCache.hash) ;
    userCaches[req.sessionID].setLevels(sqlResult);
    res.redirect('/levels');
  } catch (err) {
    res.send('error, dood' + err.message)
    // res.render('filter', {err})
  }
})



module.exports = router;
