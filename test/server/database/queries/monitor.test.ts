import { describe, it, expect } from 'vitest';

import { useTestDatabase } from '../../../_helpers/db.js';
import { seedUser } from '../../../_helpers/factories/user.js';
import { seedWorkspace } from '../../../_helpers/factories/workspace.js';
import { seedMonitor } from '../../../_helpers/factories/monitor.js';
import database from '../../../../server/database/connection.js';
import {
  createMonitor,
  deleteMonitor,
  fetchAllMonitors,
  fetchMonitor,
  fetchMonitors,
  fetchMonitorUptime,
  fetchUptimePercentage,
  fetchUsingToken,
  monitorExists,
  pauseMonitor,
  updateMonitor,
} from '../../../../server/database/queries/monitor.js';
import { UnprocessableError } from '../../../../shared/utils/errors.js';

useTestDatabase();

const setupContext = async () => {
  const u = await seedUser();
  const ws = await seedWorkspace({ ownerId: u.email });
  return { user: u, workspace: ws };
};

describe('server/database/queries/monitor', () => {
  describe('createMonitor', () => {
    it('inserts a monitor with a generated id and timestamp', async () => {
      const { user, workspace } = await setupContext();
      const created = await createMonitor({
        workspaceId: workspace.id,
        name: 'M',
        url: 'https://x.test',
        type: 'http',
        email: user.email,
      });
      expect(created.monitorId).toBeDefined();
      expect(created.created_at).toBeDefined();
    });
  });

  describe('monitorExists', () => {
    it('returns the row when present', async () => {
      const { user, workspace } = await setupContext();
      const m = await seedMonitor({
        email: user.email,
        workspaceId: workspace.id,
      });
      const row = await monitorExists(m.monitorId, workspace.id);
      expect(row?.name).toBe(m.name);
    });

    it('returns undefined for unknown id', async () => {
      const { workspace } = await setupContext();
      expect(await monitorExists('nope', workspace.id)).toBeUndefined();
    });
  });

  describe('updateMonitor', () => {
    it('updates a monitor in place', async () => {
      const { user, workspace } = await setupContext();
      const m = await seedMonitor({
        email: user.email,
        workspaceId: workspace.id,
      });

      await updateMonitor({
        monitorId: m.monitorId,
        workspaceId: workspace.id,
        name: 'Renamed',
      });

      const row = await monitorExists(m.monitorId, workspace.id);
      expect(row?.name).toBe('Renamed');
    });
  });

  describe('fetchUptimePercentage', () => {
    it('returns 0/0 when there are no heartbeats', async () => {
      const { user, workspace } = await setupContext();
      const m = await seedMonitor({
        email: user.email,
        workspaceId: workspace.id,
      });

      const result = await fetchUptimePercentage(m.monitorId, workspace.id);
      expect(result).toEqual({
        uptimePercentage: 0,
        averageHeartbeatLatency: 0,
      });
    });

    it('computes uptime % and average latency from recent heartbeats', async () => {
      const { user, workspace } = await setupContext();
      const m = await seedMonitor({
        email: user.email,
        workspaceId: workspace.id,
      });
      const client = await database.connect();
      const now = Date.now();
      const rows = [
        { isDown: false, latency: 100 },
        { isDown: false, latency: 200 },
        { isDown: true, latency: 0 },
        { isDown: false, latency: 300 },
      ];
      for (const r of rows) {
        await client!('heartbeat').insert({
          monitorId: m.monitorId,
          workspaceId: workspace.id,
          status: 200,
          latency: r.latency,
          date: new Date(now).toISOString(),
          isDown: r.isDown,
          message: 'ok',
        });
      }
      const result = await fetchUptimePercentage(m.monitorId, workspace.id);
      expect(result.uptimePercentage).toBe(75);
      expect(result.averageHeartbeatLatency).toBe(150);
    });
  });

  describe('fetchMonitorUptime', () => {
    it('returns 0 when no heartbeats exist', async () => {
      const { user, workspace } = await setupContext();
      const m = await seedMonitor({
        email: user.email,
        workspaceId: workspace.id,
      });
      expect(await fetchMonitorUptime(m.monitorId, workspace.id)).toBe(0);
    });

    it('returns the timestamp of the first heartbeat after the last down event', async () => {
      const { user, workspace } = await setupContext();
      const m = await seedMonitor({
        email: user.email,
        workspaceId: workspace.id,
      });
      const client = await database.connect();

      const downAt = new Date(Date.now() - 10_000).toISOString();
      const upAt = new Date(Date.now() - 5_000).toISOString();
      await client!('heartbeat').insert({
        monitorId: m.monitorId,
        workspaceId: workspace.id,
        status: 0,
        latency: 0,
        date: downAt,
        isDown: true,
        message: 'down',
      });
      await client!('heartbeat').insert({
        monitorId: m.monitorId,
        workspaceId: workspace.id,
        status: 200,
        latency: 100,
        date: upAt,
        isDown: false,
        message: 'ok',
      });

      const result = await fetchMonitorUptime(m.monitorId, workspace.id);
      expect(result).toBe(new Date(upAt).getTime());
    });
  });

  describe('fetchAllMonitors / fetchMonitors', () => {
    it('fetchMonitors returns only the workspace monitors with uptime fields', async () => {
      const { user, workspace } = await setupContext();
      await seedMonitor({ email: user.email, workspaceId: workspace.id });
      await seedMonitor({ email: user.email, workspaceId: workspace.id });

      const mine = await fetchMonitors(workspace.id);
      expect(mine).toHaveLength(2);
      expect(mine[0]).toHaveProperty('uptimePercentage');
    });

    it('fetchAllMonitors returns monitors across workspaces', async () => {
      const a = await setupContext();
      const b = await setupContext();
      await seedMonitor({ email: a.user.email, workspaceId: a.workspace.id });
      await seedMonitor({ email: b.user.email, workspaceId: b.workspace.id });

      expect(await fetchAllMonitors()).toHaveLength(2);
    });
  });

  describe('fetchMonitor', () => {
    it('returns the monitor merged with uptime fields', async () => {
      const { user, workspace } = await setupContext();
      const m = await seedMonitor({
        email: user.email,
        workspaceId: workspace.id,
      });
      const result = await fetchMonitor(m.monitorId, workspace.id);
      expect(result.monitorId).toBe(m.monitorId);
      expect(result).toHaveProperty('uptimePercentage');
    });

    it('throws UnprocessableError when monitor does not exist', async () => {
      const { workspace } = await setupContext();
      await expect(fetchMonitor('nope', workspace.id)).rejects.toBeInstanceOf(
        UnprocessableError
      );
    });
  });

  describe('deleteMonitor', () => {
    it('removes the monitor', async () => {
      const { user, workspace } = await setupContext();
      const m = await seedMonitor({
        email: user.email,
        workspaceId: workspace.id,
      });
      await deleteMonitor(m.monitorId, workspace.id);
      expect(await monitorExists(m.monitorId, workspace.id)).toBeUndefined();
    });
  });

  describe('pauseMonitor', () => {
    it('updates the paused flag', async () => {
      const { user, workspace } = await setupContext();
      const m = await seedMonitor({
        email: user.email,
        workspaceId: workspace.id,
      });
      await pauseMonitor(m.monitorId, workspace.id, true);
      const row = await monitorExists(m.monitorId, workspace.id);
      expect(row?.paused).toBeTruthy();
    });

    it('throws when the monitor does not exist', async () => {
      const { workspace } = await setupContext();
      await expect(
        pauseMonitor('nope', workspace.id, true)
      ).rejects.toBeInstanceOf(UnprocessableError);
    });
  });

  describe('fetchUsingToken', () => {
    it('returns the monitor matching the url field', async () => {
      const { user, workspace } = await setupContext();
      const m = await seedMonitor({
        email: user.email,
        workspaceId: workspace.id,
        url: 'push-token-1',
      });
      const result = await fetchUsingToken('push-token-1');
      expect(result.monitorId).toBe(m.monitorId);
    });

    it('throws UnprocessableError when no monitor matches', async () => {
      await setupContext();
      await expect(fetchUsingToken('nope')).rejects.toBeInstanceOf(
        UnprocessableError
      );
    });
  });
});
