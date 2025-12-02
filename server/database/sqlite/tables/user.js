import { oldPermsToFlags } from '../../../../shared/permissions/oldPermsToFlags.js';

export const userTable = async (client) => {
  const userExists = await client.schema.hasTable('user');

  if (!userExists) {
    await client.schema.createTable('user', (table) => {
      table.string('email', 255).primary().notNullable().unique();
      table.string('displayName').notNullable();
      table.string('password').defaultTo(null);
      table.string('avatar');
      table.boolean('isVerified').defaultTo(0);
      table.boolean('isOwner').defaultTo(0);
      table.boolean('sso').defaultTo(0);
      table.integer('permission').defaultTo(oldPermsToFlags[4]);
      table.datetime('createdAt');
      table.jsonb('settings').defaultTo(JSON.stringify({}));

      table.index('email');
      table.index('isVerified');
    });
  }
};
