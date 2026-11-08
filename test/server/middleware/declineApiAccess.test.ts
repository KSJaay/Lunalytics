import { describe, it, expect } from 'vitest';

import { declineApiAccess } from '../../../server/middleware/declineApiAccess.js';
import { mockReqResNext } from '../../_helpers/http.js';

describe('server/middleware/declineApiAccess', () => {
  it('returns 401 when the user authenticated via API token', async () => {
    const { req, res, next } = mockReqResNext();
    res.locals.user = { isApiToken: true };
    await declineApiAccess(req, res, next);
    expect(res._getStatusCode()).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('passes through when no API token was used', async () => {
    const { req, res, next } = mockReqResNext();
    res.locals.user = { isApiToken: false };
    await declineApiAccess(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('passes through when no user object exists', async () => {
    const { req, res, next } = mockReqResNext();
    await declineApiAccess(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
