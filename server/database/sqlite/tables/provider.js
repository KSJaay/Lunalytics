export const providersTable = async (client) => {
  const providersExists = await client.schema.hasTable('providers');

  // await client.schema.dropTableIfExists('providers');

  if (!providersExists) {
    await client.schema.createTable('providers', (table) => {
      table.increments('id');
      table.string('email');
      table.string('provider').notNullable();
      table.string('clientId').notNullable();
      table.string('clientSecret').notNullable();
      table.boolean('enabled').defaultTo(true);
      table.json('data').defaultTo({});

      table.index(['provider']);
    });
  }
};
