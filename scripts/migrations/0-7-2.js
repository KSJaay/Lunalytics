// import local files
import SQLite from '../../server/database/sqlite/setup.js';
import logger from '../../server/utils/logger.js';

const infomation = {
  title: 'Add pause for monitors',
  description:
    'Allow monitors to be paused, this will stop checks for the monitor.',
  version: '0.7.2',
};

const migrate = async () => {
  const client = await SQLite.connect();

  await client.schema.alterTable('monitor', (table) => {
    table.boolean('paused').defaultTo(false);
  });

  logger.info('Migrations', { message: '0.7.2 has been applied' });
  return;
};

export { infomation, migrate };
