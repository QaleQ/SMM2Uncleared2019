const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const queryDB = require('../utils/queryDb');

router.route('/')
.get((req, res) => {
  res.render('signup');
})
.post(async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const userData = {
      username,
      password: hashedPassword,
    };
    let sql = `INSERT INTO users SET ?;`;
    let sqlResult = await queryDB(sql, [userData])
    req.session.username = username;
    res.redirect('/levels')
  } catch (err) {
    res.render('signup', { err });
  }
});

module.exports = router;
