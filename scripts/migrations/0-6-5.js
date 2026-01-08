// import local files
import database from '../../server/database/connection.js';
import logger from '../../server/utils/logger.js';

const infomation = {
  title: 'Removes caching system',
  description:
    'Removes caching system, and adds column to certificate table for the next check time.',
  version: '0.6.5',
  breaking: true,
};

const migrate = async () => {
  const client = await database.connect();

  await client.schema.alterTable('certificate', (table) => {
    table.timestamp('nextCheck');
  });

  logger.info('Migrations', { message: '0.6.5 has been applied' });
  return;
};

export { infomation, migrate };
