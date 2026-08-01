import { describe, it, expect } from 'vitest';

import { useTestDatabase } from '../../_helpers/db.js';
import { seedUser } from '../../_helpers/factories/user.js';
import setupExistsMiddleware from '../../../server/middleware/setupExists.js';
import { mockReqResNext } from '../../_helpers/http.js';

useTestDatabase();

describe('server/middleware/setupExists', () => {
  it('returns setupRequired:true when no users exist', async () => {
    const { req, res } = mockReqResNext();
    await setupExistsMiddleware(req, res);
    const body = res._getJSONData();
    expect(body.setupRequired).toBe(true);
    expect(body.success).toBe(false);
  });

  it('returns setupRequired:false once an owner exists', async () => {
    await seedUser();
    const { req, res } = mockReqResNext();
    await setupExistsMiddleware(req, res);
    const body = res._getJSONData();
    expect(body.setupRequired).toBe(false);
    expect(body.success).toBe(true);
  });
});
