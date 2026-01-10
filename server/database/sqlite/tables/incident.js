export const incidentTable = async (client) => {
  const incidentExists = await client.schema.hasTable('incident');

  if (!incidentExists) {
    await client.schema.createTable('incident', (table) => {
      table.increments('id');
      table.string('incidentId').notNullable().primary().unique();
      table.string('title').notNullable();
      table.jsonb('monitorIds').notNullable();
      table.jsonb('messages').notNullable(); // Array of messages {message, status, createdAt, email}
      table.string('affect').notNullable(); // Operational, Maintenance, Incident, Outage
      table.string('status').notNullable(); //  Investigating, Identified, Monitoring, Resolved
      table.datetime('createdAt');
      table.datetime('completedAt');
      table.boolean('isClosed').defaultTo(false);

      table.index('createdAt');
      table.index('completedAt');
      table.index('isClosed');
    });
  }
};
