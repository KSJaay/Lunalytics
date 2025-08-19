// import local files
import SQLite from '../../server/database/sqlite/setup.js';
import logger from '../../server/utils/logger.js';
import { oldPermsToFlags } from '../../shared/permissions/oldPermsToFlags.js';

const infomation = {
  title: 'Overhaul of UI and features',
  description: 'Adds retry to monitor table',
  version: '0.10.0',
};

const migrate = async () => {
  const client = await SQLite.connect();

  await client.schema.alterTable('monitor', (table) => {
    table.integer('retry').defaultTo(1);
    table.json('icon').defaultTo({
      id: 'lunalytics',
      name: 'Lunalytics',
      url: 'https://cdn.jsdelivr.net/gh/selfhst/icons/svg/lunalytics.svg',
    });
  });

  await client.schema.alterTable('user', async (table) => {
    table.boolean('isOwner').defaultTo(false);
    table.boolean('sso').defaultTo(false);
    table.string('password').nullable().defaultTo(null).alter();
    table.integer('permission').defaultTo(oldPermsToFlags[4]).alter();
  });

  await client
    .table('user')
    .where('permission', 1)
    .update({ isOwner: true, permission: oldPermsToFlags[1] });

  await client
    .table('user')
    .where('permission', 2)
    .update({ permission: oldPermsToFlags[2] });

  await client
    .table('user')
    .where('permission', 3)
    .update({ permission: oldPermsToFlags[3] });

  await client
    .table('user')
    .where('permission', 4)
    .update({ permission: oldPermsToFlags[4] });

  logger.info('Migrations', { message: '0.10.0 has been applied' });
  return;
};

export { infomation, migrate };
