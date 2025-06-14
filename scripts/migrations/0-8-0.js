// import local files
import SQLite from '../../server/database/sqlite/setup.js';
import logger from '../../server/utils/logger.js';

const infomation = {
  title: 'Add pause for monitors',
  description:
    'Allow monitors to be paused, this will stop checks for the monitor.',
  version: '0.8.0',
};

const migrate = async () => {
  const client = await SQLite.connect();

  await client.schema.alterTable('monitor', (table) => {
    table.datetime('createdAt');
  });

  const monitors = await client('monitor').select();

  for (const monitor of monitors) {
    const oldestHeartbeat = await client('heartbeat')
      .where('monitorId', monitor.monitorId)
      .orderBy('date', 'asc')
      .first();

    if (oldestHeartbeat) {
      await client('monitor')
        .where('monitorId', monitor.monitorId)
        .update({ createdAt: oldestHeartbeat.date });
    }
  }

  logger.info('Migrations', { message: '0.8.0 has been applied' });
  return;
};

export { infomation, migrate };
