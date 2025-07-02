// import local files
import SQLite from '../../server/database/sqlite/setup.js';
import logger from '../../server/utils/logger.js';

const infomation = {
  title: 'Adds ignoreTls to monitor table',
  description: 'Adds ignoreTls to monitor table',
  version: '0.9.5',
};

const migrate = async () => {
  const client = await SQLite.connect();

  await client.schema.alterTable('monitor', (table) => {
    table.boolean('ignoreTls').defaultTo(false);
  });

  logger.info('Migrations', { message: '0.9.5 has been applied' });
  return;
};

export { infomation, migrate };
