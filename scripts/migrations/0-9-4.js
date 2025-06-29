// import local files
import SQLite from '../../server/database/sqlite/setup.js';
import logger from '../../server/utils/logger.js';

const infomation = {
  title: 'Removes email from incident table',
  description: 'Removes email from incident table',
  version: '0.9.4',
};

const migrate = async () => {
  const client = await SQLite.connect();

  await client.schema.alterTable('incident', (table) => {
    table.dropColumn('email');
  });

  logger.info('Migrations', { message: '0.9.4 has been applied' });
  return;
};

export { infomation, migrate };
