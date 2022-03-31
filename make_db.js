const mysql = require('mysql2');
require('dotenv').config();
const fs = require('fs');

let connection = mysql.createConnection({
  host: process.env.MYSQL_IP,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD
})

let csvPath = `./2019uncleared.csv`;

let sql = `CREATE DATABASE ${process.env.MYSQL_DB};`
connection.query(sql);

sql = `USE ${process.env.MYSQL_DB};`
connection.query(sql);

sql = `CREATE TABLE users
(
  id INT PRIMARY KEY AUTO_INCREMENT
  ,username VARCHAR(255) UNIQUE NOT NULL
  ,password VARCHAR(255) NOT NULL
);`
connection.query(sql);

sql = `CREATE TABLE levels
(
  name VARCHAR(255) NOT NULL
  ,description VARCHAR(255)
  ,id CHAR(9) PRIMARY KEY NOT NULL
  ,attempts INT UNSIGNED NOT NULL
  ,footprints INT UNSIGNED NOT NULL
  ,date CHAR(19) NOT NULL
  ,upload_time INT UNSIGNED NOT NULL
  ,likes INT UNSIGNED NOT NULL
  ,boos INT UNSIGNED NOT NULL
  ,comments INT UNSIGNED NOT NULL
  ,style VARCHAR(5) NOT NULL
  ,theme VARCHAR(15) NOT NULL
  ,tag1 VARCHAR(20) NOT NULL
  ,tag2 VARCHAR(20)
  ,date_datetime DATETIME
  ,cleared_at TIMESTAMP
  ,cleared_by INT
  ,FOREIGN KEY(cleared_by) REFERENCES users(id)
);`
connection.query(sql);


sql = `SET GLOBAL local_infile = true`;
connection.query(sql);

sql = `LOAD DATA LOCAL INFILE ? INTO TABLE levels
  FIELDS TERMINATED BY ','
  OPTIONALLY ENCLOSED BY '"'
  ESCAPED BY ''
  LINES TERMINATED BY '\n'
  IGNORE 1 LINES;`
connection.query({
  sql, 
  values: [csvPath],
  infileStreamFactory: () => fs.createReadStream(csvPath)
});

sql = `SET GLOBAL local_infile = true`;
connection.query(sql);

sql = `UPDATE levels SET date_datetime=STR_TO_DATE(date, '%m/%d/%Y %H:%i:%s')`
connection.query(sql);

connection.end();
