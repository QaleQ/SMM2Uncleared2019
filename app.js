if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const app = express();
const session = require('express-session');

//routes
const filterRoute = require('./routes/filter')
const levelsRoute = require('./routes/levels')
const loginRoute = require('./routes/login')
const logoutRoute = require('./routes/logout')
const overviewRoute = require('./routes/overview')
const signupRoute = require('./routes/signup')

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
