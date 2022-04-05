const express = require('express');
const router = express.Router();
const queryDB = require('../utils/queryDb');
const buildFilterString = require('../utils/buildFilterString');

router.route('/')
.get((req, res) => {
  res.render('filter', { req });
})
.post(async (req, res) => {
  try {
    let sql = buildFilterString(req.body);
    let { sqlResult } = await queryDB(sql, req.body);

    if (!sqlResult.length) throw new Error ('No results!')

    req.session.levelCache = sqlResult;
    
    res.redirect('/levels');
  } catch (err) {
    res.send('error, dood' + err.message)
    // res.render('filter', {err})
  }
})



module.exports = router;
