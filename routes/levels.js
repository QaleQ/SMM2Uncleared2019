const express = require('express');
const router = express.Router();
const queryBase = require('../utils/queryBase.js');
const styleImages = require('../utils/styleImages.js');
const asyncGetData = require('../utils/asyncGetData.js');
const connection = require('../utils/dbConnection.js');


router.get('/', async (req, res) => {
  queryData = req.session.userData ? req.session.userData : await asyncGetData();
  res.render('levels', { queryData, req, styleImages });
})

router.post('/', async (req, res) => {
  try {
    let queryArr = [...queryBase];
    let {
      match_field,
      match_option,
      match_value,
      upload_date_start,
      upload_date_end,
      style,
      theme,
      tag1,
      tag2,
      first_sort,
      sort_order
    } = req.body;

    if (match_value) {  
      let string = `%${match_value}%`;
      if (match_option == 'starts_with') string = string.slice(1)
      else if (match_option == 'ends_with') string = string.slice(0, -1)

      req.body.match_value = string;

      queryArr.push(`AND ${connection.escapeId(match_field)} LIKE :match_value`);
    }

    if (upload_date_start != '2019-06-27' || upload_date_end != '2019-12-31')
      queryArr.push(`AND (upload_datetime BETWEEN :upload_date_start AND :upload_date_end)`);

    if (style) queryArr.push(`AND style=:style`);
    if (theme) queryArr.push(`AND theme=:theme`);
    if (tag1 || tag2) {
      if (tag1 && tag2 && tag1 !== tag2) {
        queryArr.push(`AND (tag1=:tag1 OR tag1=:tag2)`);
        queryArr.push(`AND (tag2=:tag1 OR tag2=:tag2)`);
      }
      else {
        let tag = tag1 ? tag1 : tag2;
        req.body.tag = tag;
        queryArr.push(`AND (tag1=:tag OR tag2=:tag)`)
      }
    }

    let validSortOrders = ['ASC', 'DESC'];
    if (!validSortOrders.includes(sort_order)) throw new Error ('Invalid sort order')
    queryArr.push(`ORDER BY ${connection.escapeId(first_sort)} ${sort_order}\nLIMIT 10;`)
    console.log(queryArr.join('\n'))
    let [qData, _] = await connection.query(queryArr.join('\n'), req.body)
    // console.log(qData)
    if (!qData.length) throw new Error ('No results!')
    req.session.userData = qData;
    // console.log(req.session.userData);
    res.render('levels', { queryData: req.session.userData, req, styleImages });
  } catch (err) {
    // console.log(err)
    res.render('filter', {err})
  }
})

router.post('/delete/:id', async (req, res) => {
  try {
    if (!req.session.username) throw new Error('You need to be logged in to do this');
    res(`this is where we delete ${id}`)
  } catch (err) {
    res.render('levels', { queryData: req.session.userData, req, styleImages, err});
  }
})

module.exports = router;
