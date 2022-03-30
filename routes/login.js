const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const dbConnection = require('../utils/dbConnection');


router.route('/')
.get((req, res) => {
  res.render('login');
})
.post(async (req, res) => {
  try {
    const { username, password } = req.body;
    let [[queryResult],[]] = await dbConnection.query('SELECT * FROM users WHERE username = :username', req.body);
    if (!queryResult.username) throw new Error(`Username ${username} not found`)
    let storedPassword = queryResult.password;
    let loggedIn = await bcrypt.compare(password, storedPassword);
    if (!loggedIn) throw new Error('Something went wrong');
    req.session.username = queryResult.username;
    res.redirect('/levels');
  } catch (err) {
    res.render('login', { err });
  }
});


module.exports = router;
