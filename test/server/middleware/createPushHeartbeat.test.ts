import { describe, it, expect } from 'vitest';

import { useTestDatabase } from '../../_helpers/db.js';
import { seedUser } from '../../_helpers/factories/user.js';
import { seedWorkspace } from '../../_helpers/factories/workspace.js';
import { seedMonitor } from '../../_helpers/factories/monitor.js';
import database from '../../../server/database/connection.js';
import createPushHeartbeat from '../../../server/middleware/createPushHeartbeat.js';
import { mockReqResNext } from '../../_helpers/http.js';

useTestDatabase();

describe('server/middleware/createPushHeartbeat', () => {
  it('returns 401 when no token is provided', async () => {
    const { req, res } = mockReqResNext({ method: 'POST', body: {} });
    await createPushHeartbeat(req, res);
    expect(res._getStatusCode()).toBe(401);
  });

  it('returns 422 (UnprocessableError) when the token does not match a monitor', async () => {
    const { req, res } = mockReqResNext({
      method: 'POST',
      body: { token: 'nope' },
    });
    await createPushHeartbeat(req, res);
    expect(res._getStatusCode()).toBe(422);
  });

  it('inserts a heartbeat and returns 200 when the token matches', async () => {
    const u = await seedUser();
    const ws = await seedWorkspace({ ownerId: u.email });
    const m = await seedMonitor({
      email: u.email,
      workspaceId: ws.id,
      url: 'push-token-xyz',
    });

    const { req, res } = mockReqResNext({
      method: 'POST',
      body: { token: 'push-token-xyz', latency: 42, message: 'all good' },
    });
    await createPushHeartbeat(req, res);
    expect(res._getStatusCode()).toBe(200);

    const client = await database.connect();
    const beats = await client!('heartbeat').where({ monitorId: m.monitorId });
    expect(beats).toHaveLength(1);
    expect(beats[0].latency).toBe(42);
  });
});
