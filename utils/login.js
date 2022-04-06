const queryDB = require('./queryDb');
const bcrypt = require('bcrypt');


async function login(body, session) {
  let { username, password } = body;
  
  if (session.username) throw new Error(`Already signed in as ${session.username}`);
  if (!username.length) throw new Error('Username required');
  if (!password.length) throw new Error('Password required');

  let sql = `SELECT * FROM users WHERE username = :username`
  let { firstResult } = await queryDB(sql, { username });
  let approved = await bcrypt.compare(password, firstResult.password);
  if (!approved) throw new Error('Something went wrong');

  session.userID = firstResult.id;
  session.username = firstResult.username;
  return session;
}


module.exports = login;
