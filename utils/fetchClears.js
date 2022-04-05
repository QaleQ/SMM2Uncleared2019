const queryDB = require("./queryDb");

async function fetchClears(session) {
  try {
    let clears = [];
    let sql = `SELECT * FROM levels WHERE cleared_by = :userID ORDER BY cleared_at ASC;`;
    let { sqlResult } = await queryDB(sql, session);
    sqlResult.forEach(level => {
      clears.push(level);
    })
    session.clears = clears;
  } catch(err) {
    console.log(err)
    session.fetchedOnce = false;
  }
  return session;
}

module.exports = fetchClears;
