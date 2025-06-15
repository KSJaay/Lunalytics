export const userSessionTable = async (client) => {
  const sessionExists = await client.schema.hasTable('user_session');

  if (!sessionExists) {
    await client.schema.createTable('user_session', (table) => {
      table.increments('id');
      table.string('sessionId').notNullable().primary().unique();
      table.string('email').notNullable().references('email').inTable('user');
      table.jsonb('device');
      table.jsonb('data');
      table.datetime('createdAt');

      table.index('sessionId');
      table.index('email');
    });
  }
};
