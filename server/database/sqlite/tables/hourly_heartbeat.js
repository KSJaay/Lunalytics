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
    });

    client.raw(
      `CREATE INDEX IF NOT EXISTS hourly_heartbeat_monitorid_date_index ON hourly_heartbeat (monitorId, date DESC);`
    );
  }
};
