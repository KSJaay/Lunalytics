export const apiTokenTable = async (client) => {
  const apiTokenExists = await client.schema.hasTable('api_token');

  if (!apiTokenExists) {
    await client.schema.createTable('api_token', (table) => {
      table.string('token').notNullable().primary().unique();
      table.string('name').notNullable();
      table.string('permission').notNullable();
      table.string('email').notNullable();
      table.datetime('created_at');

      table
        .uuid('workspaceId')
        .notNullable()
        .references('id')
        .inTable('workspace');

      table.index('email');
      table.index('workspaceId');
      table.index(['workspaceId', 'token']);
      table.index(['workspaceId', 'email']);
    });
  }
};
