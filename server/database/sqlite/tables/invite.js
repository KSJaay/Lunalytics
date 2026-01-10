export const inviteTable = async (client) => {
  const inviteExists = await client.schema.hasTable('invite');

  if (!inviteExists) {
    await client.schema.createTable('invite', (table) => {
      table.string('email', 255).notNullable();
      table.string('token').primary().notNullable().unique();
      table.string('permission').notNullable();
      table.boolean('paused').defaultTo(0);
      table.datetime('createdAt');
      table.datetime('expiresAt').defaultTo(null);
      table.integer('limit').defaultTo(null);
      table.integer('uses').defaultTo(0);

      table.index('email');
    });
  }
};
