const express = require('express');
const router = express.Router();
const queryDB = require('../utils/queryDb');
const buildFilterString = require('../utils/buildFilterString');
const { readFlash } = require('../utils/middleware');

router.route('/')
.get(readFlash, (req, res) => {
  res.render('filter');
})
.post(async (req, res) => {
  try {
    let sql = buildFilterString(req.body);
    let { sqlResult } = await queryDB(sql, req.body);

    if (!sqlResult.length) throw new Error('No results!')

    req.session.levelCache = sqlResult;
    
    res.redirect('/levels');
  } catch (err) {
    req.flash('error', err.message)
    res.redirect('/filter')
  }
})



module.exports = router;
