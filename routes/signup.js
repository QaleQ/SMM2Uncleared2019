const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const login = require('../utils/login');
const queryDB = require('../utils/queryDb');
const { readFlash } = require('../utils/middleware');


router.route('/')
.get(readFlash, (req, res) => {
  res.render('signup');
})
.post(async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    
    let sql = `INSERT INTO users SET username = :username, password = :password`;
    await queryDB(sql, { username, password: hashedPassword});

    req.session = await login(req.body, req.session);

    res.redirect('/levels')
  } catch (err) {
    req.flash('error', 'Something went wrong!')
    res.redirect('/signup')
  }
});

module.exports = router;
