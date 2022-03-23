if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const mysql = require('mysql2/promise');
const ejs = require('ejs');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));
app.listen(3000);

main();

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_IP,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
  });

let [queryData, []] = await connection.query(`
    SELECT
    *
    ,DATE_FORMAT(upload_datetime, "%d-%m-%Y") AS upload_date_day
    ,TIME(upload_datetime) AS upload_date_time
    FROM levels
    ORDER BY levels.id ASC
    LIMIT 10;
  `)

  app.get('/', (req, res) => {
    res.render('home', { queryData })
  })
}
