export const connectionsTable = async (client) => {
  const connectionsExists = await client.schema.hasTable('connections');

  // await client.schema.dropTableIfExists('connections');

  if (!connectionsExists) {
    await client.schema.createTable('connections', (table) => {
      table.increments('id').primary();
      table
        .string('email')
        .unsigned()
        .references('email')
        .inTable('user')
        .onDelete('CASCADE');

      table.string('provider').notNullable();
      table.string('providerAccountId').notNullable();

      table.unique(['provider', 'providerAccountId']);
      table.index(['email', 'provider']);
    });
  }
};
