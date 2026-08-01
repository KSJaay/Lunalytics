// import local files
import database from '../../server/database/connection.js';
import logger from '../../server/utils/logger.js';

const infomation = {
  title: 'Support for TCP pings',
  description:
    'Adds support for TCP pings. This allows you to monitor TCP services such as databases, web servers, and more. This update also adds a new column to the monitor table to store the type of monitor, and port for tcp monitors.',
  version: '0.4.0',
};

const migrate = async () => {
  const client = await database.connect();

  await client.schema.alterTable('monitor', (table) => {
    table.string('type').defaultTo('http');
    table.integer('port').defaultTo(null);
    table.string('method').defaultTo(null).alter();
    table.string('interval').defaultTo(30).alter();
    table.string('retryInterval').defaultTo(30).alter();
    table.string('requestTimeout').defaultTo(30).alter();
    table.string('method').defaultTo(null).alter();
  });

  logger.info('Migrations', { message: '0.4.0 has been applied' });
  return;
};

export { infomation, migrate };
