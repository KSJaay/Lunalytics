import { existsSync, closeSync, openSync } from 'fs';
import knex from 'knex';

import logger from '../../utils/logger.js';
import config from '../../utils/config.js';

export class SQLite {
  constructor() {
    this.client = null;
  }

  async connect(databaseName) {
    if (!config.get('database')?.name && process.env.NODE_ENV !== 'test') {
      return logger.error('SQLITE', {
        message: 'Database name is not set in config.json',
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
      const path = `${process.cwd()}/server/database/sqlite/${dbName}.db`;

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

    const userExists = await this.client.schema.hasTable('user');

    if (!userExists) {
      await this.client.schema.createTable('user', (table) => {
        table.string('email', 255).primary().notNullable().unique();
        table.string('displayName').notNullable();
        table.string('password').notNullable();
        table.string('avatar');
        table.boolean('isVerified').defaultTo(0);
        table.integer('permission').defaultTo(4);
        table.datetime('createdAt');

        table.index('email');
        table.index('isVerified');
      });
    }

    const monitorExists = await this.client.schema.hasTable('monitor');

    if (!monitorExists) {
      await this.client.schema.createTable('monitor', (table) => {
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

    const notificationExists = await this.client.schema.hasTable(
      'notifications'
    );

    if (!notificationExists) {
      await this.client.schema.createTable('notifications', (table) => {
        table.string('id').notNullable().primary();
        table.string('platform').notNullable();
        table.string('messageType').notNullable();
        table.text('token').notNullable();
        table.text('email').notNullable();
        table.boolean('isEnabled').defaultTo(1);
        table.text('content').defaultTo(null);
        table.string('friendlyName');
        table.text('data');
        table.datetime('createdAt');

        table.index('id');
      });
    }

    const heartbeatExists = await this.client.schema.hasTable('heartbeat');

    if (!heartbeatExists) {
      await this.client.schema.createTable('heartbeat', (table) => {
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

    const hourlyHeartbeatExists = await this.client.schema.hasTable(
      'hourly_heartbeat'
    );

    if (!hourlyHeartbeatExists) {
      await this.client.schema.createTable('hourly_heartbeat', (table) => {
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

        table.index('monitorId');
        table.index(['monitorId', 'date']);
      });
    }

    const certificateExists = await this.client.schema.hasTable('certificate');

    if (!certificateExists) {
      await this.client.schema.createTable('certificate', (table) => {
        table.increments('id');
        table
          .string('monitorId')
          .notNullable()
          .references('monitorId')
          .inTable('monitor')
          .onDelete('CASCADE')
          .onUpdate('CASCADE');

        table.boolean('isValid').defaultTo(0);
        table.text('issuer');
        table.datetime('validFrom');
        table.datetime('validTill');
        table.text('validOn');
        table.integer('daysRemaining').defaultTo(0);
        table.datetime('nextCheck');

        table.index('monitorId');
      });
    }

    const statusPageExists = await this.client.schema.hasTable('status_page');

    if (!statusPageExists) {
      await this.client.schema.createTable('status_page', (table) => {
        table.increments('id');
        table.string('statusId').notNullable().primary().unique();
        table.string('statusUrl').notNullable().unique();
        table.json('settings').notNullable();
        table.json('layout').notNullable();
        table.string('email').notNullable();
        table.datetime('createdAt');

        table.index('statusId');
        table.index('statusUrl');
      });
    }

    await this.client.schema.dropTableIfExists('incident');

    const incidentExists = await this.client.schema.hasTable('incident');

    if (!incidentExists) {
      await this.client.schema.createTable('incident', (table) => {
        table.increments('id');
        table.string('incidentId').notNullable().primary().unique();
        table.string('title').notNullable();
        table.json('monitorIds').notNullable();
        table.json('messages').notNullable(); // Array of messages
        table.string('status').notNullable(); // Operational, Maintenance, Incident, Outage
        table.string('email').notNullable();
        table.datetime('createdAt');
        table.datetime('completedAt');
        table.boolean('isClosed').defaultTo(false);

        table.index('incidentId');
        table.index('createdAt');
        table.index('completedAt');
        table.index('isClosed');
      });
    }

    const sessionExists = await this.client.schema.hasTable('user_session');

    if (!sessionExists) {
      await this.client.schema.createTable('user_session', (table) => {
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

    const apiTokenExists = await this.client.schema.hasTable('api_token');

    if (!apiTokenExists) {
      await this.client.schema.createTable('api_token', (table) => {
        table.string('token').notNullable().primary().unique();
        table.string('permission').notNullable();
        table.string('email').notNullable().references('email').inTable('user');
        table.datetime('createdAt');

        table.index('token');
        table.index('email');
      });
    }

    return true;
  }
}

const client = new SQLite();

export default client;
