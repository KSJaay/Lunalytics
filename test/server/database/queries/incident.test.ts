import { describe, it, expect } from 'vitest';

import { useTestDatabase } from '../../../_helpers/db.js';
import { seedUser } from '../../../_helpers/factories/user.js';
import { seedWorkspace } from '../../../_helpers/factories/workspace.js';
import {
  createIncident,
  deleteIncident,
  fetchAllIncidents,
  fetchIncident,
  updateIncident,
} from '../../../../server/database/queries/incident.js';

useTestDatabase();

const setup = async () => {
  const u = await seedUser();
  const ws = await seedWorkspace({ ownerId: u.email });
  return { u, ws };
};

const baseIncident = {
  title: 'Outage',
  monitorIds: ['m1', 'm2'],
  messages: [{ message: 'investigating', status: 'Investigating' }],
  affect: 'Outage',
  status: 'Investigating',
  isClosed: false,
};

describe('server/database/queries/incident', () => {
  describe('createIncident', () => {
    it('inserts an incident with a generated id', async () => {
      const { ws } = await setup();
      const created = await createIncident(baseIncident, ws.id);
      expect(created.incidentId).toBeDefined();
      expect(created.title).toBe('Outage');
      expect(created.monitorIds).toEqual(['m1', 'm2']);
    });
  });

  describe('fetchIncident', () => {
    it('returns the cleaned incident', async () => {
      const { ws } = await setup();
      const created = await createIncident(baseIncident, ws.id);
      const fetched = await fetchIncident(created.incidentId, ws.id);
      expect(fetched.title).toBe('Outage');
      expect(fetched.monitorIds).toEqual(['m1', 'm2']);
    });
  });

  describe('fetchAllIncidents', () => {
    it('returns only open incidents for the workspace', async () => {
      const { ws } = await setup();
      const open = await createIncident(baseIncident, ws.id);

      await updateIncident(open.incidentId, ws.id, {
        ...baseIncident,
        isClosed: true,
      });

      await createIncident(baseIncident, ws.id);

      const incidents = await fetchAllIncidents(ws.id);
      expect(incidents).toHaveLength(1);
    });
  });

  describe('updateIncident', () => {
    it('returns the updated row', async () => {
      const { ws } = await setup();
      const created = await createIncident(baseIncident, ws.id);
      const updated = await updateIncident(created.incidentId, ws.id, {
        ...baseIncident,
        title: 'Resolved',
      });
      expect(updated?.title).toBe('Resolved');
    });

    it('returns null when nothing matched', async () => {
      const { ws } = await setup();

      const result = await updateIncident('nope', ws.id, baseIncident);
      expect(result == null).toBe(true);
    });
  });

  describe('deleteIncident', () => {
    it('removes the row', async () => {
      const { ws } = await setup();
      const created = await createIncident(baseIncident, ws.id);
      await deleteIncident(created.incidentId, ws.id);

      const { default: db } =
        await import('../../../../server/database/connection.js');
      const client = await db.connect();
      const row = await client!('incident')
        .where({ incidentId: created.incidentId })
        .first();
      expect(row).toBeUndefined();
    });
  });
});
