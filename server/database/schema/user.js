export const userTable = async (client) => {
  const userExists = await client.schema.hasTable('user');

  if (!userExists) {
    await client.schema.createTable('user', (table) => {
      table.string('email', 255).primary().notNullable().unique();
      table.string('displayName').notNullable();
      table.string('password').defaultTo(null);
      table.string('avatar');
      table.boolean('isVerified').defaultTo(0);
      table.boolean('sso').defaultTo(0);
      table.datetime('created_at');
      table.jsonb('settings').defaultTo(JSON.stringify({}));

      table.index('isVerified');
    });
  }
};
