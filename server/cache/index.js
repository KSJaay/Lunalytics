const Monitor = require('./monitor');

class Master {
  constructor() {
    this.monitor = new Monitor();
  }
}

const cache = new Master();

module.exports = cache;
