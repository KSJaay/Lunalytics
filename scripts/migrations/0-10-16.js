// import local files
import database from '../../server/database/connection.js';
import logger from '../../server/utils/logger.js';

const infomation = {
  title: 'Adds settings column to user table',
  description: 'Adds settings column to user table to store user preferences',
  version: '0.10.16',
};

const migrate = async () => {
  const client = await database.connect();

  await client.schema.alterTable('user', (table) => {
    table.jsonb('settings').defaultTo(JSON.stringify({}));
  });

  logger.info('Migrations', { message: '0.10.16 has been applied' });
  return;
};

export { infomation, migrate };
