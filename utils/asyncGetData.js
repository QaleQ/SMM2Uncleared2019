let connection = require('../utils/dbConnection.js');
const queryBase = require('./queryBase.js');

module.exports = async () => {
  let queryArray = [...queryBase]
  queryArray.push('ORDER BY upload_datetime ASC LIMIT 10;')
  let [queryResults, _] = await connection.query(queryArray.join('\n'));
  return queryResults;
};
