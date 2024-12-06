// import local files
import { migrate as migrateTcpUpdate } from './tcpUpdate-0-4-0.js';
import { migrate as migrateNotifications } from './notifications-0-6-0.js';
import { migrate as migrateCache } from './cache-0-6-5.js';

const migrationList = {
  '0.4.0': migrateTcpUpdate,
  '0.6.0': migrateNotifications,
  '0.6.5': migrateCache,
};

export default migrationList;
