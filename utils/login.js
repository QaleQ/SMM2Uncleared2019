const queryDB = require('./queryDb');
const bcrypt = require('bcrypt');


async function login(body, session) {
  let { username, password } = body;
  
  let sql = `SELECT * FROM users WHERE username = :username`
  let { firstResult } = await queryDB(sql, { username });
  let approved = await bcrypt.compare(password, firstResult.password);
  if (!approved) throw new Error('Username and password combination not found');

  session.userID = firstResult.id;
  session.username = firstResult.username;
  session.loggedIn = true;
  return session;
}


module.exports = login;
