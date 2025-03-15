// import local files
import { migrate as migrateTcpUpdate } from './0-4-0.js';
import { migrate as migrateNotifications } from './0-6-0.js';
import { migrate as migrateCache } from './0-6-5.js';
import { migrate as migratePostgres } from './0-7-0.js';
import { migrate as migratePause } from './0-7-2.js';
import { migrate as migrateStatus } from './0-8-0.js';

const migrationList = {
  '0.4.0': migrateTcpUpdate,
  '0.6.0': migrateNotifications,
  '0.6.5': migrateCache,
  '0.7.0': migratePostgres,
  '0.7.2': migratePause,
  '0.8.0': migrateStatus,
};

export default migrationList;
