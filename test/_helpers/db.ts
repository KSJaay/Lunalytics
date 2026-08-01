import knex from 'knex';
import { afterAll, afterEach, beforeAll } from 'vitest';

import database from '../../server/database/connection.js';

export const createTestDb = async () => {
  (database as any).client = null;

  const client = knex({
    client: 'better-sqlite3',
    connection: { filename: ':memory:' },
    useNullAsDefault: true,
  });

  await client.raw('PRAGMA foreign_keys = ON');
  (database as any).client = client;
  await database.setup();

  return {
    client,
    async destroy() {
      try {
        await client.destroy();
      } catch {
        /* noop */
      }
      (database as any).client = null;
    },
  };
};

export const truncateAll = async () => {
  const client = (database as any).client;
  if (!client) return;

  const tablesInDeleteOrder = [
    'heartbeat',
    'hourly_heartbeat',
    'certificate',
    'incident',
    'invite',
    'api_token',
    'user_session',
    'connections',
    'notifications',
    'providers',
    'status_page',
    'monitor',
    'member',
    'workspace',
    'user',
  ];

  for (const table of tablesInDeleteOrder) {
    try {
      await client(table).del();
    } catch {
      console.log(`Failed to delete rows from ${table} - SKIPPING`);
    }
  }
};

export const useTestDatabase = () => {
  let handle: Awaited<ReturnType<typeof createTestDb>>;

  beforeAll(async () => {
    handle = await createTestDb();
  });

  afterEach(async () => {
    await truncateAll();
  });

  afterAll(async () => {
    if (handle) await handle.destroy();
  });
};
