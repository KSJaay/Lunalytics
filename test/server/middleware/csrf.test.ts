import { describe, it, expect, vi } from 'vitest';

import {
  csrfProtection,
  CSRF_COOKIE,
  CSRF_HEADER,
} from '../../../server/middleware/csrf.js';
import { mockReqResNext } from '../../_helpers/http.js';

describe('server/middleware/csrf', () => {
  it('issues a CSRF cookie on safe methods when missing', () => {
    const { req, res, next } = mockReqResNext({ method: 'GET' });
    const cookieSpy = vi.spyOn(res, 'cookie');

    csrfProtection(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(cookieSpy).toHaveBeenCalled();
    const [name] = cookieSpy.mock.calls[0];
    expect(name).toBe(CSRF_COOKIE);
  });

  it('does not re-issue a cookie when one already exists', () => {
    const { req, res, next } = mockReqResNext({
      method: 'GET',
      cookies: { [CSRF_COOKIE]: 'existing' },
    });
    const cookieSpy = vi.spyOn(res, 'cookie');
    csrfProtection(req, res, next);
    expect(cookieSpy).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('bypasses CSRF when an API token is present', () => {
    const { req, res, next } = mockReqResNext({ method: 'POST' });
    res.locals.user = { isApiToken: true };
    csrfProtection(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('returns 403 when token is missing on a mutating request', () => {
    const { req, res, next } = mockReqResNext({ method: 'POST' });
    csrfProtection(req, res, next);
    expect(res._getStatusCode()).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 when cookie + header tokens differ', () => {
    const { req, res, next } = mockReqResNext({
      method: 'POST',
      cookies: { [CSRF_COOKIE]: 'a'.repeat(64) },
      headers: { [CSRF_HEADER]: 'b'.repeat(64) },
    });
    csrfProtection(req, res, next);
    expect(res._getStatusCode()).toBe(403);
  });

  it('passes when cookie + header tokens match', () => {
    const token = 'a'.repeat(64);
    const { req, res, next } = mockReqResNext({
      method: 'POST',
      cookies: { [CSRF_COOKIE]: token },
      headers: { [CSRF_HEADER]: token },
    });
    csrfProtection(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('returns 403 when token lengths differ (timingSafeEqual throws)', () => {
    const { req, res, next } = mockReqResNext({
      method: 'POST',
      cookies: { [CSRF_COOKIE]: 'short' },
      headers: { [CSRF_HEADER]: 'longer-token' },
    });
    csrfProtection(req, res, next);
    expect(res._getStatusCode()).toBe(403);
  });
});
