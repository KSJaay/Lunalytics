import { migrate as migrateTcpUpdate } from './tcpUpdate-0-4-0.js';

const migrationList = {
  '0.4.0': migrateTcpUpdate,
};

export default migrationList;
