export const monitorTable = async (client) => {
  const monitorExists = await client.schema.hasTable('monitor');

  if (!monitorExists) {
    await client.schema.createTable('monitor', (table) => {
      table.increments('id');
      table.string('monitorId').notNullable().primary();
      table.string('name').notNullable();
      table.string('url').notNullable();
      table.integer('port').defaultTo(null);
      table.string('type').defaultTo('http');
      table.integer('interval').defaultTo(30);
      table.integer('retryInterval').defaultTo(30);
      table.integer('requestTimeout').defaultTo(30);
      table.string('method').defaultTo(null);
      table.text('headers');
      table.text('body');
      table.text('valid_status_codes').defaultTo('["200-299"]');
      table.string('notificationId').defaultTo(null);
      table.string('notificationType').defaultTo('All');
      table.string('email').notNullable();
      table.boolean('paused').defaultTo(false);
      table.datetime('createdAt');

      table.index('monitorId');
    });
  }
};
