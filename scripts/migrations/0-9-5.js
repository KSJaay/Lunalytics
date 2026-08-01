// import local files
import database from '../../server/database/connection.js';
import logger from '../../server/utils/logger.js';

const infomation = {
  title: 'Adds ignoreTls to monitor table',
  description: 'Adds ignoreTls to monitor table',
  version: '0.9.5',
};

const migrate = async () => {
  const client = await database.connect();

  await client.schema.alterTable('monitor', (table) => {
    table.boolean('ignoreTls').defaultTo(false);
  });

  logger.info('Migrations', { message: '0.9.5 has been applied' });
  return;
};

export { infomation, migrate };
