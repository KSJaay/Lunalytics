// import local files
import SQLite from '../../server/database/sqlite/setup.js';
import logger from '../../server/utils/logger.js';

const infomation = {
  title: 'Removes caching system',
  description:
    'Removes caching system, and adds column to certificate table for the next check time.',
  version: '0.6.5',
  breaking: true,
};

const migrate = async () => {
  const client = await SQLite.connect();

  await client.schema.alterTable('certificate', (table) => {
    table.timestamp('nextCheck').defaultTo(client.fn.now());
  });

  logger.info('Migrations', { message: '0.6.5 has been applied' });
  return;
};

export { infomation, migrate };
