export const notificationsTable = async (client) => {
  const notificationExists = await client.schema.hasTable('notifications');

  if (!notificationExists) {
    await client.schema.createTable('notifications', (table) => {
      table.string('id').notNullable().primary().unique();
      table.string('platform').notNullable();
      table.string('messageType').notNullable();
      table.text('token').notNullable();
      table.text('email').notNullable();
      table.boolean('isEnabled').defaultTo(1);
      table.text('content').defaultTo(null);
      table.string('friendlyName');
      table.text('data');
      table
        .uuid('workspaceId')
        .notNullable()
        .references('id')
        .inTable('workspace');

      table.timestamps(true, true);

      table.index('id');
      table.index('workspaceId');
      table.index(['workspaceId', 'id']);
    });
  }
};
