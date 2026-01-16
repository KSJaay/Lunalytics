export const certificateTable = async (client) => {
  const certificateExists = await client.schema.hasTable('certificate');

  if (!certificateExists) {
    await client.schema.createTable('certificate', (table) => {
      table.increments('id');
      table
        .string('monitorId')
        .notNullable()
        .references('monitorId')
        .inTable('monitor')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');

      table.boolean('isValid').defaultTo(0);
      table.text('issuer');
      table.datetime('validFrom');
      table.datetime('validTill');
      table.text('validOn');
      table.integer('daysRemaining').defaultTo(0);
      table.datetime('nextCheck');

      table
        .uuid('workspaceId')
        .notNullable()
        .references('id')
        .inTable('workspace');

      table.index('workspaceId');
      table.index(['workspaceId', 'monitorId']);
    });
  }
};
