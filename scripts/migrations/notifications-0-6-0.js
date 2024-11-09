// import local files
import SQLite from '../../server/database/sqlite/setup.js';
import logger from '../../server/utils/logger.js';

const infomation = {
  title: 'Support for Notifications',
  description:
    'Adds support for Notifications. This allows you to send notifications to users when a monitor goes down or up. This update also adds a page to the dashboard to view all notifications.',
  version: '0.6.0',
  breaking: true,
};

const migrate = async () => {
  const client = await SQLite.connect();

  // Add notifications object field to monitors table
  await client.schema.alterTable('monitor', (table) => {
    table.string('notificationId');
    table.string('notificationType').defaultTo('All');
  });

  logger.info('Migrations', { message: '0.6.0 has been applied' });
};

export { infomation, migrate };
