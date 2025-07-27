import { existsSync, closeSync, openSync } from 'fs';
import knex from 'knex';

import logger from '../../utils/logger.js';
import config from '../../utils/config.js';
import { apiTokenTable } from './tables/api_token.js';
import { certificateTable } from './tables/certificate.js';
import { heartbeatTable } from './tables/heartbeat.js';
import { hourlyHeartbeatTable } from './tables/hourly_heartbeat.js';
import { incidentTable } from './tables/incident.js';
import { inviteTable } from './tables/invite.js';
import { monitorTable } from './tables/monitor.js';
import { notificationsTable } from './tables/notifications.js';
import { statusPageTable } from './tables/status_page.js';
import { userTable } from './tables/user.js';
import { userSessionTable } from './tables/user_session.js';

export class SQLite {
  constructor() {
    this.client = null;
  }

  async connect(databaseName) {
    if (!config.get('database')?.name && process.env.NODE_ENV !== 'test') {
      return logger.notice('SQLITE', {
        message:
          'Database name is not set in config.json, visit http://localhost:2308/setup to setup application',
      });
    }

    const dbName = databaseName || config.get('database')?.name || 'lunalytics';
    const databaseType = config.get('database')?.type || 'better-sqlite3';

    if (this.client) return this.client;

    if (databaseType === 'pg') {
      this.client = knex({
        client: databaseType,
        connection: { ...config.get('database')?.config },
        useNullAsDefault: true,
      });

      const query = await this.client.raw(
        `SELECT 1 AS exists FROM pg_database WHERE datname = ?`,
        [dbName]
      );

      const [databaseExists] = query.rows ?? [];

      if (!databaseExists) {
        await this.client.raw(`CREATE DATABASE ${dbName}`);

        logger.info('PostgreSQL', { message: 'Created PostgreSQL database' });
      }

      this.client.destroy();

      this.client = knex({
        client: databaseType,
        connection: { ...config.get('database')?.config, database: dbName },
        useNullAsDefault: true,
      });

      logger.info('PostgreSQL', {
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

      logger.info('SQLite', {
        message: 'Connected to SQLite database',
      });
    }

    return this.client;
  }

  async setup() {
    if (!this.client) return false;

    await apiTokenTable(this.client);
    await certificateTable(this.client);
    await heartbeatTable(this.client);
    await hourlyHeartbeatTable(this.client);
    await incidentTable(this.client);
    await inviteTable(this.client);
    await monitorTable(this.client);
    await notificationsTable(this.client);
    await statusPageTable(this.client);
    await userTable(this.client);
    await userSessionTable(this.client);

    return true;
  }
}

const client = new SQLite();

export default client;
