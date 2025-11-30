// import local files
import SQLite from '../../server/database/sqlite/setup.js';
import logger from '../../server/utils/logger.js';

const infomation = {
  title: 'Add parentId to monitor table',
  description: 'Adds parentId to monitor table',
  version: '0.10.13',
};

const migrate = async () => {
  const client = await SQLite.connect();

  await client.schema.alterTable('monitor', (table) => {
    table.string('parentId').nullable().defaultTo(null);
  });

  logger.info('Migrations', { message: '0.10.13 has been applied' });
  return;
};

export { infomation, migrate };
