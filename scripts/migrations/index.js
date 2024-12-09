// import local files
import { migrate as migrateTcpUpdate } from './tcpUpdate-0-4-0.js';
import { migrate as migrateNotifications } from './notifications-0-6-0.js';
import { migrate as migrateCache } from './cache-0-6-5.js';
import { migrate as migratePostgres } from './postgres-0-7-0.js';

const migrationList = {
  '0.4.0': migrateTcpUpdate,
  '0.6.0': migrateNotifications,
  '0.6.5': migrateCache,
  '0.7.0': migratePostgres,
};

export default migrationList;
