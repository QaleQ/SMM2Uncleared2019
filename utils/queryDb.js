const dbConnection = require('../config/dbConnection');

async function queryDB(sql, data = []) {
  let [sqlResult, _] = await dbConnection.query(sql, data)
  if (sqlResult.length == 1) return sqlResult[0];
  return sqlResult;
}

module.exports = queryDB;
