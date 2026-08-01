// import local files
import database from '../../server/database/connection.js';
import logger from '../../server/utils/logger.js';

const infomation = {
  title: 'Updates incidents table',
  description: 'Adds affect to the incidents table',
  version: '0.9.0',
};

const migrate = async () => {
  const client = await database.connect();

  await client.schema.alterTable('incident', (table) => {
    table.dropColumn('monitorIds');
    table.dropColumn('messages');
  });

  await client.schema.alterTable('incident', (table) => {
    table.string('affect').notNullable();
    table.jsonb('messages').notNullable();
    table.jsonb('monitorIds').notNullable();
  });

  logger.info('Migrations', { message: '0.9.0 has been applied' });
  return;
};

export { infomation, migrate };
