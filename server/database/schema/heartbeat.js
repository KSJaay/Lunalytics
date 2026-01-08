export const heartbeatTable = async (client) => {
  const heartbeatExists = await client.schema.hasTable('heartbeat');

  if (!heartbeatExists) {
    await client.schema.createTable('heartbeat', (table) => {
      table.increments('id');
      table
        .string('monitorId')
        .notNullable()
        .references('monitorId')
        .inTable('monitor')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');

      table.integer('status').notNullable();
      table.integer('latency').notNullable();
      table.datetime('date').notNullable();
      table.boolean('isDown').defaultTo(false);
      table.text('message').notNullable();
      table.jsonb('data').defaultTo(null);

      table
        .uuid('workspaceId')
        .notNullable()
        .references('id')
        .inTable('workspace');

      table.index('workspaceId');
      table.index(['workspaceId', 'monitorId']);
      table.index(['workspaceId', 'monitorId', 'date']);
    });

    client.raw(
      `CREATE INDEX IF NOT EXISTS heartbeat_monitorid_date_index ON heartbeat (monitorId, date DESC);`
    );
  }
};
