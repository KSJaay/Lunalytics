// import local files
import database from '../../server/database/connection.js';
import { ownerExists } from '../../server/database/queries/user.js';
import { createWorkspace } from '../../server/database/queries/workspace.js';
import logger from '../../server/utils/logger.js';
import randomId from '../../server/utils/randomId.js';

const infomation = {
  title: 'Updates user table to support workspaces',
  description: 'Adds workspace table and updates all tables to support this',
  version: '0.10.20',
};

const migrate = async () => {
  const client = await database.connect();

  const owner = await ownerExists();

  if (!owner) {
    return;
  }

  const workspaceExists = await client('workspace').select().first();

  if (workspaceExists) {
    logger.info('Migrations', {
      message: '0.10.20 has already been applied, skipping',
    });
    return;
  }

  const workspace = await client('workspace')
    .insert({
      id: randomId(),
      ownerId: owner.email,
      name: 'Default Workspace',
      logo: '/logo.svg',
    })
    .returning('*')?.[0];

  await client.schema.alterTable('api_token', (table) => {
    table.uuid('workspaceId').references('id').inTable('workspace');

    table.renameColumn('createdAt', 'created_at');

    table.index('workspaceId');
    table.index(['workspaceId', 'token']);
    table.index(['workspaceId', 'email']);

    table.dropIndex('token');
    table.dropIndex('email');
  });

  await client('api_token').update({ workspaceId: workspace.id });

  await client.schema.alterTable('certificate', (table) => {
    table.uuid('workspaceId').references('id').inTable('workspace');

    table.index('workspaceId');
    table.index(['workspaceId', 'monitorId']);

    table.dropIndex('monitorId');
  });

  await client('certificate').update({ workspaceId: workspace.id });

  await client.schema.alterTable('heartbeat', (table) => {
    table.uuid('workspaceId').references('id').inTable('workspace');
    table.jsonb('data').defaultTo(null);

    table.index('workspaceId');
    table.index(['workspaceId', 'monitorId']);
    table.index(['workspaceId', 'monitorId', 'date']);

    table.dropIndex('monitorId');
    table.dropIndex(['monitorId', 'date']);
  });

  await client('heartbeat').update({ workspaceId: workspace.id });

  await client.schema.alterTable('hourly_heartbeat', (table) => {
    table.uuid('workspaceId').references('id').inTable('workspace');

    table.index('workspaceId');
    table.index(['workspaceId', 'monitorId']);
    table.index(['workspaceId', 'monitorId', 'date']);

    table.dropIndex('monitorId');
    table.dropIndex(['monitorId', 'date']);
  });

  await client('hourly_heartbeat').update({ workspaceId: workspace.id });

  await client.schema.alterTable('incident', (table) => {
    table.uuid('workspaceId').references('id').inTable('workspace');

    table.renameColumn('createdAt', 'created_at');
    table.datetime('updated_at');

    table.index('workspaceId');
    table.index(['workspaceId', 'incidentId']);
    table.index(['workspaceId', 'isClosed']);
    table.index(['workspaceId', 'created_at']);
    table.index(['workspaceId', 'completedAt']);

    table.dropIndex('incidentId');
    table.dropIndex('createdAt');
    table.dropIndex('completedAt');
    table.dropIndex('isClosed');
  });

  await client('incident').update({ workspaceId: workspace.id });

  await client.schema.alterTable('invite', (table) => {
    table.uuid('workspaceId').references('id').inTable('workspace');

    table.renameColumn('createdAt', 'created_at');
    table.datetime('updated_at');

    table.index('workspaceId');
    table.index(['workspaceId', 'token']);
    table.index(['workspaceId', 'email']);

    table.dropIndex('email');
    table.dropIndex('token');
  });

  await client('invite').update({ workspaceId: workspace.id });

  await client.schema.alterTable('monitor', (table) => {
    table.uuid('workspaceId').references('id').inTable('workspace');

    table.renameColumn('createdAt', 'created_at');
    table.datetime('updated_at');

    table.index('workspaceId');
    table.index(['workspaceId', 'monitorId']);
    table.index(['workspaceId', 'parentId']);

    table.dropIndex('monitorId');
  });

  await client('monitor').update({ workspaceId: workspace.id });

  await client.schema.alterTable('notifications', (table) => {
    table.uuid('workspaceId').references('id').inTable('workspace');

    table.renameColumn('createdAt', 'created_at');
    table.datetime('updated_at');

    table.index('workspaceId');
    table.index(['workspaceId', 'id']);

    table.dropIndex('id');
  });

  await client('notifications').update({ workspaceId: workspace.id });

  await client.schema.alterTable('status_page', (table) => {
    table.uuid('workspaceId').references('id').inTable('workspace');

    table.renameColumn('createdAt', 'created_at');
    table.datetime('updated_at');

    table.index('workspaceId');
    table.index(['workspaceId', 'statusId']);
    table.index(['workspaceId', 'statusUrl']);

    table.dropIndex('statusId');
  });

  await client('status_page').update({ workspaceId: workspace.id });

  await client.schema.alterTable('user', (table) => {
    table.renameColumn('createdAt', 'created_at');
  });

  const members = await client('user').select(
    'email',
    'displayName',
    'avatar',
    'isVerified',
    'permission',
    'created_at',
    'sso'
  );

  await client.schema.alterTable('user', (table) => {
    table.dropColumn('isOwner');
    table.dropColumn('permission');
  });

  for (const member of members) {
    await client('member').insert({
      email: member.email,
      workspaceId: workspace.id,
      permission: member.permission,
    });
  }

  await client.schema.alterTable('user_session', (table) => {
    table.renameColumn('createdAt', 'created_at');
  });

  await client.schema.alterTable('connections', (table) => {
    table.renameColumn('createdAt', 'created_at');
  });

  await client.schema.alterTable('api_token', (table) => {
    table
      .uuid('workspaceId')
      .notNullable()
      .references('id')
      .inTable('workspace')
      .alter();
  });

  await client.schema.alterTable('certificate', (table) => {
    table
      .uuid('workspaceId')
      .notNullable()
      .references('id')
      .inTable('workspace')
      .alter();
  });

  await client.schema.alterTable('heartbeat', (table) => {
    table
      .uuid('workspaceId')
      .notNullable()
      .references('id')
      .inTable('workspace')
      .alter();
  });

  await client.schema.alterTable('hourly_heartbeat', (table) => {
    table
      .uuid('workspaceId')
      .notNullable()
      .references('id')
      .inTable('workspace')
      .alter();
  });

  await client.schema.alterTable('incident', (table) => {
    table
      .uuid('workspaceId')
      .notNullable()
      .references('id')
      .inTable('workspace')
      .alter();
  });

  await client.schema.alterTable('invite', (table) => {
    table
      .uuid('workspaceId')
      .notNullable()
      .references('id')
      .inTable('workspace')
      .alter();
  });

  await client.schema.alterTable('monitor', (table) => {
    table
      .uuid('workspaceId')
      .notNullable()
      .references('id')
      .inTable('workspace')
      .alter();
  });

  await client.schema.alterTable('notifications', (table) => {
    table
      .uuid('workspaceId')
      .notNullable()
      .references('id')
      .inTable('workspace')
      .alter();
  });

  await client.schema.alterTable('status_page', (table) => {
    table
      .uuid('workspaceId')
      .notNullable()
      .references('id')
      .inTable('workspace')
      .alter();
  });

  logger.info('Migrations', { message: '0.10.20 has been applied' });
  return;
};

export { infomation, migrate };
