// import local files
import SQLite from '../../server/database/sqlite/setup.js';
import logger from '../../server/utils/logger.js';

const infomation = {
  title: 'Adds json query support',
  description: 'Adds json_query to the monitor table',
  version: '0.9.7',
};

const migrate = async () => {
  const client = await SQLite.connect();

  await client.schema.alterTable('monitor', (table) => {
    table.json('json_query');
  });

  logger.info('Migrations', { message: '0.9.5 has been applied' });
  return;
};

export { infomation, migrate };
