import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { afterAll, afterEach, beforeAll } from 'vitest';

import database from '../../server/database/connection.js';

let counter = 0;

const dbPath = (name: string) => join(process.cwd(), 'data', `${name}.db`);

const cleanupFile = (name: string) => {
  for (const suffix of ['', '-shm', '-wal']) {
    const p = dbPath(name) + suffix;
    if (existsSync(p)) {
      try {
        unlinkSync(p);
      } catch {
        console.log(`Failed to delete ${p} — REMOVE IT MANUALLY YOU PEASANT.`);
      }
    }
  }
};

export const createTestDb = async () => {
  const workerId = process.env.VITEST_POOL_ID || '0';
  const name = `test-${workerId}-${++counter}-${Date.now()}`;

  cleanupFile(name);

  (database as any).client = null;

  const client = await database.connect(name);
  if (!client) {
    throw new Error('Failed to open test SQLite database');
  }

  await database.setup();

  return {
    name,
    client,
    async destroy() {
      try {
        await client.destroy();
      } catch {
        /* noop */
      }
      (database as any).client = null;
      cleanupFile(name);
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
