export const hourlyHeartbeatTable = async (client) => {
  const hourlyHeartbeatExists = await client.schema.hasTable(
    'hourly_heartbeat'
  );

  if (!hourlyHeartbeatExists) {
    await client.schema.createTable('hourly_heartbeat', (table) => {
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
      `CREATE INDEX IF NOT EXISTS hourly_heartbeat_monitorid_date_index ON hourly_heartbeat (monitorId, date DESC);`
    );
  }
};
