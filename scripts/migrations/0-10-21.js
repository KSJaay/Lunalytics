// import local files
import database from '../../server/database/connection.js';
import logger from '../../server/utils/logger.js';

const infomation = {
  title: 'Dropdown redundant indexes',
  description:
    'Drops various redundant indexes from the database and adds improved ones.',
  version: '0.10.21',
};

const migrate = async () => {
  const client = await database.connect();

  await client.raw(`DROP INDEX IF EXISTS heartbeat_monitorid_index;`);
  await client.raw(`DROP INDEX IF EXISTS hourly_heartbeat_monitorid_index;`);

  client.raw(
    `CREATE INDEX IF NOT EXISTS heartbeat_monitorid_date_index ON heartbeat (monitorId, date DESC);`
  );

  client.raw(
    `CREATE INDEX IF NOT EXISTS hourly_heartbeat_monitorid_date_index ON hourly_heartbeat (monitorId, date DESC);`
  );

  const redundantIndexes = [
    'api_token_token_index',
    'heartbeat_monitorid_index',
    'hourly_heartbeat_monitorid_index',
    'incident_incidentid_index',
    'invite_token_index',
    'status_page_statusid_index',
    'status_page_statusurl_index',
    'user_session_sessionid_index',
    'user_email_index',
  ];

  for (const indexName of redundantIndexes) {
    await client.raw(`DROP INDEX IF EXISTS ${indexName};`);
  }

  logger.info('Migrations', { message: '0.10.21 has been applied' });
  return;
};

export { infomation, migrate };
