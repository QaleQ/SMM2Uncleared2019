const queryDB = require('./queryDb');
const bcrypt = require('bcrypt');



module.exports = async function(user, pass) {
  let sql = `SELECT * FROM users WHERE username = ?`
  let sqlResult = await queryDB(sql, [user]);
  let approved = bcrypt.compare(pass, sqlResult.password);
  if (!approved) throw new Error('Something went wrong');
  return { id: sqlResult.id, username: sqlResult.username }
}
