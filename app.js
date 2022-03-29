if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const session = require('express-session');

//routes
const filterRoute = require('./routes/filter.js')
const levelsRoute = require('./routes/levels.js')
const loginRoute = require('./routes/login.js')
const logoutRoute = require('./routes/logout.js')
const overviewRoute = require('./routes/overview.js')
const signupRoute = require('./routes/signup.js')

app.set('view engine', 'ejs');

app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({extended: true}));
app.use(session({secret: process.env.SECRET}));

app.listen(3000);


app.use('/filter', filterRoute);
app.use('/levels', levelsRoute);
app.use('/overview', overviewRoute);
app.use('/login', loginRoute);
app.use('/logout', logoutRoute);
app.use('/signup', signupRoute);

app.get('/', (req, res) => {
  res.redirect('/levels')
});
