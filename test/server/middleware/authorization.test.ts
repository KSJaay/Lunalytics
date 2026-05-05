import { describe, it, expect } from 'vitest';

import { useTestDatabase } from '../../_helpers/db.js';
import { authenticate } from '../../_helpers/auth.js';
import { mockReqResNext } from '../../_helpers/http.js';
import authorization from '../../../server/middleware/authorization.js';
import { SESSION_TOKEN } from '../../../shared/constants/cookies.js';
import { AUTH_ERRORS } from '../../../shared/constants/errors/auth.js';

useTestDatabase();

describe('server/middleware/authorization', () => {
  it('returns 401 with A002 for /api requests with no auth at all', async () => {
    const { req, res, next } = mockReqResNext({ url: '/api/monitor' });
    await authorization(req, res, next);
    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toEqual(AUTH_ERRORS.A002);
    expect(next).not.toHaveBeenCalled();
  });

  it('passes non-/api requests with no auth through to next()', async () => {
    const { req, res, next } = mockReqResNext({ url: '/some/page' });
    await authorization(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('returns 401 A004 when a session token does not match any session', async () => {
    const { req, res, next } = mockReqResNext({
      url: '/api/monitor',
      cookies: { [SESSION_TOKEN]: 'no-such-session' },
    });
    await authorization(req, res, next);
    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData().code).toBe(AUTH_ERRORS.A004.code);
  });

  it('attaches the user to response.locals on a valid session', async () => {
    const ctx = await authenticate();
    const { req, res, next } = mockReqResNext({
      url: '/api/monitor',
      cookies: { [SESSION_TOKEN]: ctx.sessionToken },
    });
    await authorization(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.locals.user.email).toBe(ctx.user.email);
  });

  it('returns 401 A001 when an API token does not exist', async () => {
    const { req, res, next } = mockReqResNext({
      url: '/api/monitor',
      headers: { authorization: 'fake-token' },
    });
    await authorization(req, res, next);
    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData().code).toBe(AUTH_ERRORS.A001.code);
  });
});
