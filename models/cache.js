const queryDB = require('../utils/queryDb');
const Level = require("./level");

class Cache {
  constructor(hash) {
    this.hash = hash;
    this.levels = [];
  }
  updateHash() {
    this.levels = [];
    this.hash += 1;
  }
  async setLevels(array = null) {
    this.levels = [];
    if (array === null) {
      let sql = `SELECT * FROM levels WHERE ISNULL(cleared_by) ORDER BY date_datetime LIMIT 10;`;
      let sqlResult = await queryDB(sql);
      this.setLevels(sqlResult)
    } else {
      array.forEach(level => {
        this.levels.push(new Level(level));
      })
    }
  }
  removeLevel(id) {
    for (let i = 0; i < this.levels.length; i++) {
      if (this.levels[i].id !== id) continue;
      this.levels.splice(i, 1)
      break;
    }
  }
}

module.exports = Cache;



