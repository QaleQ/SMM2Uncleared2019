const express = require('express');
const router = express.Router();
const styleImages = require('../utils/styleImages');
const asyncGetData = require('../utils/asyncGetData');
const connection = require('../utils/dbConnection');


router.get('/', async (req, res) => {
  queryData = req.session.userData ? req.session.userData : await asyncGetData();
  res.render('levels', { queryData, req, styleImages });
})

router.post('/delete/:id', async (req, res) => {
  try {
    // if (!req.session.username) throw new Error('You need to be logged in to do this');
    if (!/^[0-9]+$/.test(req.params.id)) throw new Error('invalid level id')
    let query = `DELETE FROM levels WHERE id = :id`
    await connection.query(query, req.params);

    res.send(`${req.params.id} deleted!`)
  } catch (err) {
    res.send(err.message)
    // res.render('levels', { queryData: req.session.userData, req, styleImages, err});
  }
})

module.exports = router;
