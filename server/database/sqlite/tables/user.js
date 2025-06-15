export const userTable = async (client) => {
  const userExists = await client.schema.hasTable('user');

  if (!userExists) {
    await client.schema.createTable('user', (table) => {
      table.string('email', 255).primary().notNullable().unique();
      table.string('displayName').notNullable();
      table.string('password').notNullable();
      table.string('avatar');
      table.boolean('isVerified').defaultTo(0);
      table.integer('permission').defaultTo(4);
      table.datetime('createdAt');

      table.index('email');
      table.index('isVerified');
    });
  }
};
