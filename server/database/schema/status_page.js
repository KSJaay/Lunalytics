export const statusPageTable = async (client) => {
  const statusPageExists = await client.schema.hasTable('status_page');

  if (!statusPageExists) {
    await client.schema.createTable('status_page', (table) => {
      table.increments('id');
      table.string('statusId').notNullable().primary().unique();
      table.string('statusUrl').notNullable().unique();
      table.json('settings').notNullable();
      table.json('layout').notNullable();
      table.string('email').notNullable();
      table
        .uuid('workspaceId')
        .notNullable()
        .references('id')
        .inTable('workspace');

      table.timestamps(true, true);

      table.index('statusId');
      table.index('statusUrl');
      table.index('workspaceId');
      table.index(['workspaceId', 'statusId']);
      table.index(['workspaceId', 'statusUrl']);
    });
  }
};
