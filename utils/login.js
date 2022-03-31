const queryDB = require('./queryDb');
const bcrypt = require('bcrypt');



module.exports = async function(user, pass) {
  let sql = `SELECT * FROM users WHERE username = ?`
  let { firstResult } = await queryDB(sql, [user]);
  let approved = bcrypt.compare(pass, firstResult.password);
  if (!approved) throw new Error('Something went wrong');
  return { id: firstResult.id, username: firstResult.username }
}
