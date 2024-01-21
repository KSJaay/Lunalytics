const { v4: uuidv4 } = require('uuid');

const randomId = () => {
  return uuidv4();
};

module.exports = randomId;
