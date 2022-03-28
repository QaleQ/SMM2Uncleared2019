if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const bcrypt = require('bcrypt');
const session = require('express-session');

app.set('view engine', 'ejs');

app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({extended: true}));
app.use(session({secret: process.env.SECRET}));


app.listen(3000);

const styleImages = {
  'SMB1': 'https://seeklogo.com/images/S/super-mario-bros-logo-B712683EBE-seeklogo.com.png',
  'SMB3': 'https://seeklogo.com/images/S/super-mario-bros-3-logo-3F9AF3A1F1-seeklogo.com.png',
  'SMW': 'https://seeklogo.com/images/S/super-mario-world-logo-CC25D10D3A-seeklogo.com.png',
  'NSMBU': 'https://static.wikia.nocookie.net/logopedia/images/e/e7/NSMBU_2D_Logo.svg',
  'SM3DW': 'https://static.wikia.nocookie.net/logopedia/images/e/e7/Logo_EN_-_Super_Mario_3D_World.png'
}

let queryBase = [
  'SELECT *',
  `,DATE_FORMAT(upload_datetime, '%d/%m/%Y') AS upload_date_day`,
  `,TIME_FORMAT(upload_datetime, '%H:%i') AS upload_date_time`,
  `,SUBSTRING(clear_check_time, 4) AS cc_time`,
  `,REPLACE(level_code, '-', '') AS level_code_short`,
  'FROM levels',
  'WHERE NOT ISNULL(id)',
]


main();

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_IP,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
  });

  connection.config.namedPlaceholders = true;
  let queryArray = [...queryBase]
  queryArray.push('ORDER BY upload_datetime ASC LIMIT 10')
  let [queryData, []] = await connection.query(queryArray.join('\n'));

  app.get('/', (req, res) => {
    res.redirect('/levels')
  });

  app.get('/levels', (req, res) => {
    res.render('levels', { queryData, req, styleImages });
  })

  app.get('/login', (req, res) => {
    res.render('login');
  });

  app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      let [[queryResult],[]] = await connection.query('SELECT * FROM users WHERE username = :username', req.body);
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

  app.get('/signup', (req, res) => {
    res.render('signup');
  });

  app.post('/signup', async (req, res) => {
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 12);
      const userData = {
        username,
        password: hashedPassword,
      };
      let queryResult = await connection.query(`INSERT INTO users SET ?`, [ userData ]);
      req.session.username = username;
      res.redirect('/levels')
    } catch (err) {
      res.render('signup', { err });
    }
  });

  app.post('/logout', async (req, res) => {
    req.session.destroy();
    res.redirect('/levels');
  });

  app.get('/filter', (req, res) => {
    res.render('filter', { req });
  })

  app.post('/levels', async (req, res) => {
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

      let filteredData = await connection.query(queryArr.join('\n'), req.body)
      if (!filteredData[0].length) throw new Error ('No results!')
      res.render('levels', { queryData: filteredData[0], req, styleImages });
    } catch (err) {
      res.render('filter', {err})
    }
  })

  app.get('/overview', (req, res) => {
    res.render('overview', { req });
  })
}
