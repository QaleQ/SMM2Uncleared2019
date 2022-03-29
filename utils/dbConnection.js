if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.MYSQL_IP,
  host: process.env.MYSQL_IP,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  waitForConnections: true,
  namedPlaceholders: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();
