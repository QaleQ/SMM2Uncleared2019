const dbConnection = require('../utils/dbConnection');
const Level = require("./level");

class Cache {
  constructor(hash) {
    this.hash = hash;
    this.levels = [];
  }
  resetLevels() {
    this.levels = [];
  }
  updateHash() {
    this.levels = [];
    this.hash += 1;
  }
  async addLevels(array = null) {
    if (array === null) {
      let sql = `SELECT * FROM levels LIMIT 10;`;
      let [result, _] = await dbConnection.query(sql);
      this.addLevels(result)
    } else {
      array.forEach(level => {
        this.levels.push(new Level(level));
      })
    }
  }
}

module.exports = Cache;



