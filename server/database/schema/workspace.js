export const workspaceTable = async (client) => {
  const workspaceExists = await client.schema.hasTable('workspace');

  if (!workspaceExists) {
    await client.schema.createTable('workspace', (table) => {
      table.uuid('id').notNullable().unique();
      table.string('name').notNullable();
      table
        .string('ownerId', 255)
        .notNullable()
        .references('email')
        .inTable('user');
      table.string('icon').defaultTo(null);
      table.string('apiUrl').defaultTo(null);
      table.string('apiToken').defaultTo(null);

      table.timestamps(true, true);

      table.index('id');
      table.index('ownerId');
    });
  }
};
