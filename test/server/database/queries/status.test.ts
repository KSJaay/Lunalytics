import { describe, it, expect } from 'vitest';

import { useTestDatabase } from '../../../_helpers/db.js';
import { seedUser } from '../../../_helpers/factories/user.js';
import { seedWorkspace } from '../../../_helpers/factories/workspace.js';
import { seedMonitor } from '../../../_helpers/factories/monitor.js';
import {
  createStatusPage,
  deleteStatusPage,
  fetchAllStatusPages,
  fetchIncidentsUsingIdArray,
  fetchMonitorsUsingIdArray,
  fetchStatusPageUsingId,
  fetchStatusPageUsingUrl,
  fetchWorkspaceStatusPages,
  updateStatusPage,
} from '../../../../server/database/queries/status.js';
import { createIncident } from '../../../../server/database/queries/incident.js';
import { ConflictError } from '../../../../shared/utils/errors.js';

useTestDatabase();

const setup = async () => {
  const u = await seedUser();
  const ws = await seedWorkspace({ ownerId: u.email });
  return { u, ws };
};

const validHeader = {
  type: 'header',
  title: { showLogo: true, showTitle: true },
  status: { showTitle: true, showStatus: true },
};

describe('server/database/queries/status', () => {
  describe('createStatusPage', () => {
    it('creates a status page and returns it', async () => {
      const { u, ws } = await setup();
      const created = await createStatusPage(
        ws.id,
        { url: 'unique-url' },
        [validHeader],
        u
      );
      expect(created.statusUrl).toBe('unique-url');
    });

    it('throws ConflictError when the URL is taken', async () => {
      const { u, ws } = await setup();
      await createStatusPage(ws.id, { url: 'dupe' }, [validHeader], u);
      await expect(
        createStatusPage(ws.id, { url: 'dupe' }, [validHeader], u)
      ).rejects.toBeInstanceOf(ConflictError);
    });

    it('filters out empty layout components', async () => {
      const { u, ws } = await setup();
      const created = await createStatusPage(
        ws.id,
        { url: 'filter' },
        [
          validHeader,
          { type: 'uptime', monitors: [], autoAdd: false },
          { type: 'customHTML', content: '' },
          { type: 'customHTML', content: '<p>hi</p>' },
        ],
        u
      );
      const layout = JSON.parse(created.layout);
      expect(layout).toHaveLength(2);
    });
  });

  describe('updateStatusPage', () => {
    it('updates layout/settings', async () => {
      const { u, ws } = await setup();
      const created = await createStatusPage(
        ws.id,
        { url: 'u' },
        [validHeader],
        u
      );
      const updated = await updateStatusPage(
        ws.id,
        created.statusId,
        { url: 'updated' },
        [validHeader],
        u
      );
      expect(updated.statusUrl).toBe('updated');
    });

    it('throws ConflictError when the page does not exist', async () => {
      const { u, ws } = await setup();
      await expect(
        updateStatusPage(ws.id, 'nope', { url: 'x' }, [validHeader], u)
      ).rejects.toBeInstanceOf(ConflictError);
    });
  });

  describe('deleteStatusPage', () => {
    it('removes the page', async () => {
      const { u, ws } = await setup();
      const created = await createStatusPage(
        ws.id,
        { url: 'd' },
        [validHeader],
        u
      );
      await deleteStatusPage(created.statusId, ws.id);
      expect(
        await fetchStatusPageUsingId(created.statusId, ws.id)
      ).toBeUndefined();
    });

    it('throws ConflictError when missing', async () => {
      const { ws } = await setup();
      await expect(deleteStatusPage('nope', ws.id)).rejects.toBeInstanceOf(
        ConflictError
      );
    });
  });

  describe('fetchAllStatusPages / fetchWorkspaceStatusPages', () => {
    it('returns cleaned status pages scoped to workspace', async () => {
      const a = await setup();
      const b = await setup();
      await createStatusPage(a.ws.id, { url: 'a' }, [validHeader], a.u);
      await createStatusPage(b.ws.id, { url: 'b' }, [validHeader], b.u);

      expect(await fetchAllStatusPages()).toHaveLength(2);
      expect(await fetchWorkspaceStatusPages(a.ws.id)).toHaveLength(1);
    });
  });

  describe('fetchStatusPageUsingUrl', () => {
    it('returns the page by url', async () => {
      const { u, ws } = await setup();
      await createStatusPage(ws.id, { url: 'find-me' }, [validHeader], u);
      const found = await fetchStatusPageUsingUrl('find-me');
      expect(found?.statusUrl).toBe('find-me');
    });
  });

  describe('fetchMonitorsUsingIdArray', () => {
    it('returns monitors that match the given ids and workspace', async () => {
      const { u, ws } = await setup();
      const m1 = await seedMonitor({ email: u.email, workspaceId: ws.id });
      await seedMonitor({ email: u.email, workspaceId: ws.id });

      const result = await fetchMonitorsUsingIdArray([m1.monitorId], ws.id);
      expect(result).toHaveLength(1);
      expect(result![0].monitorId).toBe(m1.monitorId);
    });
  });

  describe('fetchIncidentsUsingIdArray', () => {
    it('returns incidents within the cutoff window referencing any of the monitors', async () => {
      const { ws } = await setup();
      const incident = await createIncident(
        {
          title: 'Out',
          monitorIds: ['m-a', 'm-b'],
          messages: [],
          affect: 'Outage',
          status: 'Investigating',
        },
        ws.id
      );

      const result = await fetchIncidentsUsingIdArray(['m-a'], ws.id);
      expect(result).toHaveLength(1);
      expect(result![0].incidentId).toBe(incident.incidentId);
    });
  });
});
