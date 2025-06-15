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

      table.index('monitorId');
      table.index(['monitorId', 'date']);
    });
  }
};
