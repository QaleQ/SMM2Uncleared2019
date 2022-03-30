const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const queryDB = require('../utils/queryDb');

router.route('/')
.get((req, res) => {
  res.render('login');
})
.post(async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username.length) throw new Error('Username required')
    if (!password.length) throw new Error('Password required')
    if (req.session.username) throw new Error(`Already signed in as ${req.session.username}`);
    let sql = `SELECT * FROM users WHERE username = :username;`;
    let sqlResult = await queryDB(sql, req.body)
    let storedPassword = sqlResult.password;
    let loggedIn = await bcrypt.compare(password, storedPassword);
    if (!loggedIn) throw new Error('Something went wrong');
    req.session.username = sqlResult.username;
    res.redirect('/levels');
  } catch (err) {
    res.render('login', { err });
  }
});


module.exports = router;
