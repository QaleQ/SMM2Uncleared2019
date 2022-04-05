const queryDB = require("../utils/queryDb");

class ServerCache {

  constructor() {
    this.hash = Math.floor(Math.random() * 10000000)

    this.levelCache = [];
    this.clearedLevels = new Set();
  }

  updateHash() {
    this.hash += 1;
  }

  matchHash(hash) {
    return this.hash === hash;
  }

  async initLevels() {
    let sql = `SELECT * FROM levels WHERE ISNULL(cleared_by) ORDER BY upload_datetime LIMIT 10;`;
    let { sqlResult } = await queryDB(sql);
    this.levelCache = sqlResult;
  }
}

module.exports = ServerCache;
