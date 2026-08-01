import { describe, it, expect, vi } from 'vitest';

import addInviteToCookie from '../../../server/middleware/addInviteToCookie.js';
import { mockReqResNext } from '../../_helpers/http.js';

describe('server/middleware/addInviteToCookie', () => {
  it('sets the invite cookie when ?invite= is present', () => {
    const { req, res, next } = mockReqResNext({ query: { invite: 'tok123' } });
    const cookieSpy = vi.spyOn(res, 'cookie');
    addInviteToCookie(req, res, next);
    expect(cookieSpy).toHaveBeenCalled();
    expect(cookieSpy.mock.calls[0][0]).toBe('invite');
    expect(cookieSpy.mock.calls[0][1]).toBe('tok123');
    expect(next).toHaveBeenCalled();
  });

  it('passes through when no invite query is present', () => {
    const { req, res, next } = mockReqResNext();
    const cookieSpy = vi.spyOn(res, 'cookie');
    addInviteToCookie(req, res, next);
    expect(cookieSpy).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
