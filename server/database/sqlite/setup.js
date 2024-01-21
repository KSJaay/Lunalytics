const fs = require('fs');
const knex = require('knex');

const logger = require('../../utils/logger');

class SQLite {
  constructor() {
    this.path = `${__dirname}/${process.env.DATABASE_NAME || 'lunalytics.db'}`;
    this.client = null;
  }

  async connect() {
    if (this.client) return this.client;

    if (!fs.existsSync(this.path)) {
      fs.closeSync(fs.openSync(this.path, 'w'));
    }

    this.client = knex({
      client: 'sqlite3',
      connection: {
        filename: this.path,
      },
      useNullAsDefault: true,
    });

    logger.info('SQLite', 'Connected to SQLite database');

    return this.client;
  }

  async setup() {
    const userExists = await this.client.schema.hasTable('user');

    if (!userExists) {
      await this.client.schema.createTable('user', (table) => {
        table.string('email', 255).primary().notNullable().unique();
        table.string('username').notNullable().unique();
        table.string('displayName').notNullable().unique();
        table.string('password').notNullable();
        table.string('avatar');
        table.timestamp('createdAt').defaultTo(this.client.fn.now());

        table.index('email');
        table.index('username');
      });
    }

    const monitorExists = await this.client.schema.hasTable('monitor');

    if (!monitorExists) {
      await this.client.schema.createTable('monitor', (table) => {
        table.increments('id').primary();
        table.string('monitorId').notNullable();
        table.string('name').notNullable();
        table.string('url').notNullable();
        table.integer('interval').notNullable();
        table.integer('retryInterval').notNullable();
        table.integer('requestTimeout').notNullable();
        table.string('method').notNullable();
        table.text('headers');
        table.text('body');
        table.text('valid_status_codes').defaultTo('["200-299"]');
        table.string('username').notNullable();

        table.index('monitorId');
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
        table.timestamp('date').notNullable();
        table.boolean('isDown').defaultTo(0);
        table.text('message').notNullable();

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
        table.string('issuer');
        table.timestamp('validFrom');
        table.timestamp('validTill');
        table.string('validOn');
        table.integer('daysRemaining').defaultTo(0);

        table.index('monitorId');
      });
    }
  }
}

module.exports = new SQLite();
