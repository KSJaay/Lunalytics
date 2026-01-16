import { existsSync, closeSync, openSync } from 'fs';
import knex from 'knex';

import logger from '../utils/logger.js';
import config from '../utils/config.js';
import { apiTokenTable } from './schema/api_token.js';
import { certificateTable } from './schema/certificate.js';
import { heartbeatTable } from './schema/heartbeat.js';
import { hourlyHeartbeatTable } from './schema/hourly_heartbeat.js';
import { incidentTable } from './schema/incident.js';
import { inviteTable } from './schema/invite.js';
import { monitorTable } from './schema/monitor.js';
import { notificationsTable } from './schema/notifications.js';
import { statusPageTable } from './schema/status_page.js';
import { userTable } from './schema/user.js';
import { userSessionTable } from './schema/user_session.js';
import { connectionsTable } from './schema/connection.js';
import { providersTable } from './schema/provider.js';
import { workspaceTable } from './schema/workspace.js';
import { memberTable } from './schema/member.js';
import { MissingDatabaseConnectionError } from '../../shared/utils/errors.js';

export class Database {
  client: knex.Knex | null;

  constructor() {
    this.client = null;
  }

  async connect(databaseName?: string) {
    if (!config.get('database')?.name && process.env.NODE_ENV !== 'test') {
      logger.notice('DATABASE', {
        message:
          'Database name is not set in config.json, visit http://localhost:2308/setup to setup application',
      });

      return;
    }

    const dbName = databaseName || config.get('database')?.name || 'lunalytics';
    const databaseType = config.get('database')?.type || 'better-sqlite3';

    if (this.client) return this.client;

    if (databaseType === 'pg') {
      this.client = knex({
        client: databaseType,
        connection: { ...config.get('database')?.config, database: dbName },
        useNullAsDefault: true,
      });

      const query = await this.client.raw(
        `SELECT 1 AS exists FROM pg_database WHERE datname = ?`,
        [dbName]
      );

      const [databaseExists] = query.rows ?? [];

      if (!databaseExists) {
        await this.client.raw(`CREATE DATABASE ${dbName}`);

        logger.info('DATABASE', { message: 'Created PostgreSQL database' });
      }

      this.client.destroy();

      this.client = knex({
        client: databaseType,
        connection: { ...config.get('database')?.config, database: dbName },
        useNullAsDefault: true,
      });

      logger.info('DATABASE', {
        message: 'Connected to PostgreSQL database',
      });
    }

    if (databaseType === 'better-sqlite3') {
      const path = `${process.cwd()}/data/${dbName}.db`;

      if (!existsSync(path)) {
        closeSync(openSync(path, 'w'));
      }

      this.client = knex({
        client: databaseType,
        connection: { filename: path },
        useNullAsDefault: true,
      });

      // Need to enable this for foreign key to work
      await this.client.raw('PRAGMA foreign_keys = ON');

      await this.client.raw('PRAGMA journal_mode = WAL'); // Better concurrency
      await this.client.raw('PRAGMA cache_size = -12000'); // 12 MB cache

      logger.info('DATABASE', {
        message: 'Connected to SQLite database',
      });
    }

    if (!this.client) {
      throw new MissingDatabaseConnectionError();
    }

    return this.client;
  }

  async setup() {
    if (!this.client) return false;

    await apiTokenTable(this.client);
    await certificateTable(this.client);
    await connectionsTable(this.client);
    await heartbeatTable(this.client);
    await hourlyHeartbeatTable(this.client);
    await incidentTable(this.client);
    await inviteTable(this.client);
    await monitorTable(this.client);
    await notificationsTable(this.client);
    await providersTable(this.client);
    await statusPageTable(this.client);
    await userTable(this.client);
    await userSessionTable(this.client);
    await workspaceTable(this.client);
    await memberTable(this.client);

    return true;
  }
}

const database = new Database();

export default database;
