// import local files
import SQLite from '../../server/database/sqlite/setup.js';
import logger from '../../server/utils/logger.js';

const infomation = {
  title: 'Overhaul of UI and features',
  description: 'Adds retry to monitor table',
  version: '0.10.0',
};

const migrate = async () => {
  const client = await SQLite.connect();

  await client.schema.alterTable('monitor', (table) => {
    table.integer('retry').defaultTo(1);
  });

  logger.info('Migrations', { message: '0.10.0 has been applied' });
  return;
};

export { infomation, migrate };
