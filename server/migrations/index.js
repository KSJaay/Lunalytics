const { migrate: migrateTcpUpdate } = require('./tcpUpdate-0-4-0');

const migrationList = {
  '0.4.0': migrateTcpUpdate,
};

module.exports = migrationList;
