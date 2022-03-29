module.exports = [
  `SELECT *`,
  `,DATE_FORMAT(upload_datetime, '%d/%m/%Y') AS upload_date_day`,
  `,TIME_FORMAT(upload_datetime, '%H:%i') AS upload_date_time`,
  `,SUBSTRING(clear_check_time, 4) AS cc_time`,
  `,REPLACE(level_code, '-', '') AS level_code_short`,
  `FROM levels`,
  `WHERE NOT ISNULL(id)`,
]
