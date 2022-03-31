if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const app = express();
const session = require('express-session');
const ensureCache = require('./utils/ensureCache');

app.set('view engine', 'ejs');

app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({extended: true}));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(ensureCache);

app.listen(3000);

app.use('/filter', require('./routes/filter'));
app.use('/levels', require('./routes/levels'));
app.use('/overview', require('./routes/overview'));
app.use('/login', require('./routes/login'));
app.use('/logout', require('./routes/logout'));
app.use('/signup', require('./routes/signup'));
app.use('/user', require('./routes/user'));

app.get('/', (req, res) => {
  res.redirect('/levels')
});

app.get('/*', (req, res) => {
  res.redirect('/');
})
