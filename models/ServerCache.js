const queryDB = require("../utils/queryDb");

// store a time created on server's levelcache, garbage collect when reaching specific amount of levels mayhbe?

class ServerCache {

  constructor() {
    this._initialized = false;
    this._hash = Math.floor(Math.random() * 10000000)

    this.levelCache = {};
    this.clearedLevels = new Set();
  }

  get hash() {
    return this._hash;
  }

  get initialized() {
    return this._initialized;
  }

  get numLevels() {
    return Object.keys(this.levelCache).length
  }

  updateHash() {
    this._hash += 1;
  }

  matchHash(hash) {
    return this._hash === hash;
  }

  cacheCopy() {
    let newCache = {};
    for (let i = 0; i < Math.min(10, this.numLevels); i++) {
      let level = Object.keys(this.levelCache)[i];
      newCache[level] = Object.assign({}, this.levelCache[level]);
    }
    return newCache;
  }

  async updateLevelCache(levelArray = null) {
    this._initialized = true;
    if (levelArray !== null) {
      for (let level of levelArray) {
        this.levelCache[level.id] = level;
      }
      return;
    }
    let sql = `SELECT * FROM levels WHERE ISNULL(cleared_by) ORDER BY upload_datetime LIMIT 10;`;
    let { sqlResult } = await queryDB(sql);
    this.updateLevelCache(sqlResult);
  }
}

module.exports = ServerCache;
