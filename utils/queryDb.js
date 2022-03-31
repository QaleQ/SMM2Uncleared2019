const dbConnection = require('../config/dbConnection');

async function queryDB(sql, data = []) {
  let [sqlResult, _] = await dbConnection.query(sql, data)
  return { sqlResult, firstResult: sqlResult[0] };
}

module.exports = queryDB;
