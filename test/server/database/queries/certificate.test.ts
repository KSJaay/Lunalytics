import { describe, it, expect } from 'vitest';

import { useTestDatabase } from '../../../_helpers/db.js';
import { seedUser } from '../../../_helpers/factories/user.js';
import { seedWorkspace } from '../../../_helpers/factories/workspace.js';
import { seedMonitor } from '../../../_helpers/factories/monitor.js';
import database from '../../../../server/database/connection.js';
import {
  deleteCertificate,
  fetchCertificate,
  updateCertificate,
} from '../../../../server/database/queries/certificate.js';

useTestDatabase();

const setup = async () => {
  const u = await seedUser();
  const ws = await seedWorkspace({ ownerId: u.email });
  const m = await seedMonitor({ email: u.email, workspaceId: ws.id });
  return { u, ws, m };
};

describe('server/database/queries/certificate', () => {
  describe('fetchCertificate', () => {
    it('returns isValid:false when no certificate exists', async () => {
      const { ws, m } = await setup();
      expect(await fetchCertificate(m.monitorId, ws.id)).toEqual({
        isValid: false,
      });
    });

    it('returns the cleaned certificate when present', async () => {
      const { ws, m } = await setup();
      const client = await database.connect();
      await client!('certificate').insert({
        monitorId: m.monitorId,
        workspaceId: ws.id,
        isValid: 1,
        issuer: '[]',
        validOn: '[]',
        daysRemaining: 30,
      });

      const result: any = await fetchCertificate(m.monitorId, ws.id);
      expect(result.isValid).toBe(true);
      expect(result.daysRemaining).toBe(30);
    });
  });

  describe('updateCertificate', () => {
    it('inserts when no row exists', async () => {
      const { ws, m } = await setup();
      await updateCertificate(m.monitorId, ws.id, {
        isValid: 1,
        issuer: '[]',
        validOn: '[]',
        daysRemaining: 60,
      });
      const result: any = await fetchCertificate(m.monitorId, ws.id);
      expect(result.daysRemaining).toBe(60);
    });

    it('updates when a row already exists', async () => {
      const { ws, m } = await setup();
      await updateCertificate(m.monitorId, ws.id, {
        isValid: 1,
        daysRemaining: 10,
      });
      await updateCertificate(m.monitorId, ws.id, { daysRemaining: 5 });

      const client = await database.connect();
      const row = await client!('certificate')
        .where({ monitorId: m.monitorId })
        .first();
      expect(row.daysRemaining).toBe(5);
    });
  });

  describe('deleteCertificate', () => {
    it('removes the row', async () => {
      const { ws, m } = await setup();
      await updateCertificate(m.monitorId, ws.id, { isValid: 1 });
      await deleteCertificate(m.monitorId, ws.id);
      expect(await fetchCertificate(m.monitorId, ws.id)).toEqual({
        isValid: false,
      });
    });
  });
});
