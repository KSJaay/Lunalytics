import { oldPermsToFlags } from '../../../shared/permissions/oldPermsToFlags.js';

export const memberTable = async (client) => {
  const memberExists = await client.schema.hasTable('member');

  if (!memberExists) {
    await client.schema.createTable('member', (table) => {
      table
        .string('email', 255)
        .notNullable()
        .references('email')
        .inTable('user');
      table
        .uuid('workspaceId')
        .notNullable()
        .references('id')
        .inTable('workspace');
      table.integer('permission').defaultTo(oldPermsToFlags[4]);

      table.index('email');
      table.index(['workspaceId', 'email']);

      table.timestamps(true, true);
    });
  }
};
