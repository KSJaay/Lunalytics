export const inviteTable = async (client) => {
  const inviteExists = await client.schema.hasTable('invite');

  if (!inviteExists) {
    await client.schema.createTable('invite', (table) => {
      table.string('email', 255).notNullable();
      table.string('token').primary().notNullable().unique();
      table.string('permission').notNullable();
      table.boolean('paused').defaultTo(0);
      table.datetime('expiresAt').defaultTo(null);
      table.integer('limit').defaultTo(null);
      table.integer('uses').defaultTo(0);
      table
        .uuid('workspaceId')
        .notNullable()
        .references('id')
        .inTable('workspace');

      table.timestamps(true, true);

      table.index('workspaceId');
      table.index(['workspaceId', 'token']);
      table.index(['workspaceId', 'email']);
    });
  }
};
