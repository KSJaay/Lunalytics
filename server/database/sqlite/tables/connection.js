export const connectionsTable = async (client) => {
  const connectionsExists = await client.schema.hasTable('connections');

  // await client.schema.dropTableIfExists('connections');

  if (!connectionsExists) {
    await client.schema.createTable('connections', (table) => {
      table
        .string('email')
        .unsigned()
        .references('email')
        .inTable('user')
        .onDelete('CASCADE');

      table.string('provider').notNullable();
      table.string('accountId').notNullable();
      table.string('createdAt').notNullable();

      table.unique(['provider', 'accountId']);
      table.index(['email', 'provider']);
    });
  }
};
