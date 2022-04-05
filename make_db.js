const mysql = require('mysql2');
require('dotenv').config();
const fs = require('fs');

async function main() {
  let connection = mysql.createConnection({
    host: process.env.MYSQL_IP,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    multipleStatements: true
  })
  let csvPath = `./2019uncleared.csv`;

  let sql = `SHOW GLOBAL VARIABLES LIKE 'local_infile'`
  let [[infileValue], _] = await connection.promise().query(sql);

  sql = `CREATE DATABASE ${process.env.MYSQL_DB};
  USE ${process.env.MYSQL_DB};
  CREATE TABLE users
  (
    id SMALLINT PRIMARY KEY AUTO_INCREMENT
    ,username VARCHAR(255) UNIQUE NOT NULL
    ,password VARCHAR(255) NOT NULL
  );

  CREATE TABLE levels
  (
    id MEDIUMINT UNSIGNED PRIMARY KEY AUTO_INCREMENT
    ,level_name VARCHAR(255) NOT NULL
    ,description VARCHAR(255) DEFAULT ''
    ,level_code CHAR(11) NOT NULL UNIQUE
    ,attempts INT UNSIGNED NOT NULL
    ,footprints INT UNSIGNED NOT NULL
    ,upload_datetime DATETIME NOT NULL
    ,upload_date_date CHAR(10) NOT NULL
    ,upload_date_time CHAR(8) NOT NULL
    ,clear_time CHAR(9) NOT NULL
    ,likes SMALLINT UNSIGNED NOT NULL
    ,boos SMALLINT UNSIGNED NOT NULL
    ,comments SMALLINT UNSIGNED NOT NULL
    ,style VARCHAR(255) NOT NULL
    ,theme VARCHAR(255) NOT NULL
    ,tag1 VARCHAR(255)
    ,tag2 VARCHAR(255)
    ,cleared_at TIMESTAMP DEFAULT NULL
    ,cleared_by SMALLINT DEFAULT NULL
    ,FOREIGN KEY(cleared_by) REFERENCES users(id)
  );`
  connection.query(sql);
  
  sql = `
  SET GLOBAL local_infile = true;
  LOAD DATA LOCAL INFILE ? INTO TABLE levels
  FIELDS TERMINATED BY ','
  OPTIONALLY ENCLOSED BY '"'
  ESCAPED BY ''
  LINES TERMINATED BY '\n'
  IGNORE 1 LINES
  (level_name,description,@LEVEL_CODE_STR,attempts,footprints,@DATE_STR,@CLEAR_STR,likes,boos,comments,style,theme,@FIRST_TAG,@SECOND_TAG)
  SET
    level_code = CONCAT
    (
      SUBSTRING(@LEVEL_CODE_STR, 1, 3), '-'
      ,SUBSTRING(@LEVEL_CODE_STR, 4, 3), '-'
      ,SUBSTRING(@LEVEL_CODE_STR, 7, 3)
    )
    ,upload_datetime = STR_TO_DATE(@DATE_STR, "%m/%d/%Y %H:%i:%s")
    ,upload_date_date = SUBSTRING(@DATE_STR, 1, 10)
    ,upload_date_time = SUBSTRING(@DATE_STR, 12)
    ,clear_time = SUBSTRING(CAST(SEC_TO_TIME(@CLEAR_STR / 1000) AS TIME(3)), 4)
    ,tag1 = IF(@FIRST_TAG = 'None', NULL, @FIRST_TAG)
    ,tag2 = IF(@FIRST_TAG = @SECOND_TAG, NULL, @SECOND_TAG);
    SET GLOBAL local_infile = ${infileValue.Value};`;
  connection.query({
    sql, 
    values: [csvPath],
    infileStreamFactory: () => fs.createReadStream(csvPath)
  });

  connection.end();
}

main();
