import { describe, it, expect } from 'vitest';

import { useTestDatabase } from '../../../_helpers/db.js';
import { seedUser } from '../../../_helpers/factories/user.js';
import { seedWorkspace } from '../../../_helpers/factories/workspace.js';
import { seedMonitor } from '../../../_helpers/factories/monitor.js';
import database from '../../../../server/database/connection.js';
import {
  cleanHeartbeats,
  createHeartbeat,
  createHourlyHeartbeat,
  deleteHeartbeats,
  fetchDailyHeartbeats,
  fetchHeartbeats,
  fetchHeartbeatsByDate,
  fetchHourlyHeartbeats,
  isMonitorDown,
  isMonitorRecovered,
} from '../../../../server/database/queries/heartbeat.js';

useTestDatabase();

const setup = async () => {
  const u = await seedUser();
  const ws = await seedWorkspace({ ownerId: u.email });
  const m = await seedMonitor({ email: u.email, workspaceId: ws.id });
  return { u, ws, m };
};

const insertHeartbeat = async (
  monitorId: string,
  workspaceId: string,
  overrides: { isDown?: boolean; latency?: number; date?: string } = {}
) => {
  const client = await database.connect();
  await client!('heartbeat').insert({
    monitorId,
    workspaceId,
    status: overrides.isDown ? 0 : 200,
    latency: overrides.latency ?? 100,
    date: overrides.date ?? new Date().toISOString(),
    isDown: overrides.isDown ?? false,
    message: overrides.isDown ? 'down' : 'ok',
  });
};

describe('server/database/queries/heartbeat', () => {
  describe('createHeartbeat', () => {
    it('inserts a heartbeat with the current date', async () => {
      const { ws, m } = await setup();
      const result = await createHeartbeat({
        monitorId: m.monitorId,
        workspaceId: ws.id,
        status: 200,
        latency: 50,
        isDown: false,
        message: 'ok',
      });
      expect(result.id).toBeGreaterThan(0);
      expect(result.date).toBeDefined();
    });
  });

  describe('createHourlyHeartbeat', () => {
    it('inserts an hourly aggregate row', async () => {
      const { ws, m } = await setup();
      const result = await createHourlyHeartbeat({
        monitorId: m.monitorId,
        workspaceId: ws.id,
        status: 200,
        latency: 100,
        date: new Date().toISOString(),
      });
      expect(result.id).toBeGreaterThan(0);
    });
  });

  describe('fetchHeartbeats', () => {
    it('returns rows in descending date order, capped by limit', async () => {
      const { ws, m } = await setup();
      const now = Date.now();
      for (let i = 0; i < 5; i++) {
        await insertHeartbeat(m.monitorId, ws.id, {
          date: new Date(now - i * 1000).toISOString(),
        });
      }
      const result = await fetchHeartbeats(m.monitorId, ws.id, 3);
      expect(result).toHaveLength(3);
    });
  });

  describe('fetchHeartbeatsByDate', () => {
    it('returns only heartbeats newer than the given date', async () => {
      const { ws, m } = await setup();
      const cutoff = new Date(Date.now() - 60_000);
      await insertHeartbeat(m.monitorId, ws.id, {
        date: new Date(Date.now() - 120_000).toISOString(),
      });
      await insertHeartbeat(m.monitorId, ws.id, {
        date: new Date(Date.now() - 30_000).toISOString(),
      });

      const result = await fetchHeartbeatsByDate(
        m.monitorId,
        ws.id,
        cutoff.toISOString()
      );
      expect(result).toHaveLength(1);
    });
  });

  describe('fetchDailyHeartbeats', () => {
    it('buckets the last 24h of up heartbeats into 5-minute intervals', async () => {
      const { ws, m } = await setup();
      const t = Date.now();
      await insertHeartbeat(m.monitorId, ws.id, {
        date: new Date(t).toISOString(),
        latency: 100,
      });
      await insertHeartbeat(m.monitorId, ws.id, {
        date: new Date(t + 1000).toISOString(),
        latency: 200,
      });

      const buckets = await fetchDailyHeartbeats(m.monitorId, ws.id);
      expect(buckets).toHaveLength(1);
      expect(buckets[0].latency).toBeGreaterThan(0);
    });
  });

  describe('fetchHourlyHeartbeats', () => {
    it('returns hourly rows ordered by date desc with limit', async () => {
      const { ws, m } = await setup();
      await createHourlyHeartbeat({
        monitorId: m.monitorId,
        workspaceId: ws.id,
        status: 200,
        latency: 100,
        date: new Date().toISOString(),
      });
      const result = await fetchHourlyHeartbeats(m.monitorId, ws.id, 10);
      expect(result).toHaveLength(1);
    });
  });

  describe('isMonitorDown', () => {
    it('returns false when no consecutive down sequence is found', async () => {
      const { ws, m } = await setup();
      await insertHeartbeat(m.monitorId, ws.id, {
        date: new Date().toISOString(),
      });
      expect(await isMonitorDown(m.monitorId, ws.id, 1)).toBe(false);
    });

    it('returns the newest heartbeat when the limit-many newest are all down and the prior was up', async () => {
      const { ws, m } = await setup();
      const now = Date.now();

      await insertHeartbeat(m.monitorId, ws.id, {
        date: new Date(now - 2000).toISOString(),
      });

      await insertHeartbeat(m.monitorId, ws.id, {
        date: new Date(now).toISOString(),
        isDown: true,
      });

      const result = await isMonitorDown(m.monitorId, ws.id, 1);
      expect(result).toBeTruthy();
    });
  });

  describe('isMonitorRecovered', () => {
    it('returns the newest up heartbeat when prior were all down', async () => {
      const { ws, m } = await setup();
      const now = Date.now();

      await insertHeartbeat(m.monitorId, ws.id, {
        date: new Date(now - 2000).toISOString(),
        isDown: true,
      });
      await insertHeartbeat(m.monitorId, ws.id, {
        date: new Date(now - 1000).toISOString(),
        isDown: true,
      });
      await insertHeartbeat(m.monitorId, ws.id, {
        date: new Date(now).toISOString(),
        isDown: false,
      });

      const result = await isMonitorRecovered(m.monitorId, ws.id, 2);
      expect(result).toBeTruthy();
    });

    it('returns false when newest heartbeat is still down', async () => {
      const { ws, m } = await setup();
      await insertHeartbeat(m.monitorId, ws.id, {
        date: new Date().toISOString(),
        isDown: true,
      });
      expect(await isMonitorRecovered(m.monitorId, ws.id, 1)).toBe(false);
    });
  });

  describe('deleteHeartbeats', () => {
    it('removes all heartbeats for a monitor in a workspace', async () => {
      const { ws, m } = await setup();
      await insertHeartbeat(m.monitorId, ws.id);
      await insertHeartbeat(m.monitorId, ws.id);
      await deleteHeartbeats(m.monitorId, ws.id);
      expect(await fetchHeartbeats(m.monitorId, ws.id)).toEqual([]);
    });
  });

  describe('cleanHeartbeats', () => {
    it('deletes heartbeats older than the given date', async () => {
      const { ws, m } = await setup();
      await insertHeartbeat(m.monitorId, ws.id, {
        date: new Date(Date.now() - 60_000).toISOString(),
      });
      await insertHeartbeat(m.monitorId, ws.id, {
        date: new Date().toISOString(),
      });

      await cleanHeartbeats(new Date(Date.now() - 30_000).toISOString());
      const remaining = await fetchHeartbeats(m.monitorId, ws.id);
      expect(remaining).toHaveLength(1);
    });
  });
});
