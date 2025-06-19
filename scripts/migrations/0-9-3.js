// import local files
import SQLite from '../../server/database/sqlite/setup.js';
import logger from '../../server/utils/logger.js';

const infomation = {
  title: 'Updates api token table',
  description: 'Updates api token to remove foreign key from email',
  version: '0.9.3',
};

const migrate = async () => {
  const client = await SQLite.connect();

  await client.schema.alterTable('api_token', (table) => {
    table.dropForeign('email');
    table.string('name').notNullable();
  });

  logger.info('Migrations', { message: '0.9.3 has been applied' });
  return;
};

export { infomation, migrate };
