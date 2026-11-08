import { v7 as uuidv7 } from 'uuid';

import database from '../../../server/database/connection.js';

let counter = 0;

export interface MonitorOverrides {
  monitorId?: string;
  name?: string;
  url?: string;
  type?: string;
  interval?: number;
  retry?: number;
  retryInterval?: number;
  requestTimeout?: number;
  method?: string | null;
  headers?: string | null;
  body?: string | null;
  valid_status_codes?: string;
  notificationId?: string | null;
  notificationType?: string;
  email: string;
  paused?: boolean;
  ignoreTls?: boolean;
  workspaceId: string;
}

export const monitorFactory = (overrides: MonitorOverrides) => {
  const i = ++counter;
  return {
    monitorId: overrides.monitorId ?? uuidv7(),
    name: overrides.name ?? `Monitor ${i}`,
    url: overrides.url ?? `https://example-${i}.test`,
    type: overrides.type ?? 'http',
    interval: overrides.interval ?? 30,
    retry: overrides.retry ?? 1,
    retryInterval: overrides.retryInterval ?? 30,
    requestTimeout: overrides.requestTimeout ?? 30,
    method: overrides.method ?? 'GET',
    headers: overrides.headers ?? null,
    body: overrides.body ?? null,
    valid_status_codes: overrides.valid_status_codes ?? '["200-299"]',
    notificationId: overrides.notificationId ?? null,
    notificationType: overrides.notificationType ?? 'All',
    email: overrides.email,
    paused: overrides.paused ?? false,
    ignoreTls: overrides.ignoreTls ?? false,
    workspaceId: overrides.workspaceId,
  };
};

export const seedMonitor = async (overrides: MonitorOverrides) => {
  const data = monitorFactory(overrides);
  const client = await database.connect();
  if (!client) throw new Error('No DB connection');

  await client('monitor').insert({
    ...data,
    paused: data.paused ? 1 : 0,
    ignoreTls: data.ignoreTls ? 1 : 0,
  });

  return data;
};
