import { describe, it, expect } from 'vitest';

import isDemo from '../../../server/middleware/demo.js';
import { mockReqResNext } from '../../_helpers/http.js';

describe('server/middleware/demo', () => {
  it('always calls next() when not in production / not in demo mode', async () => {
    const { req, res, next } = mockReqResNext();
    await isDemo(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('does not modify the response in test environment', async () => {
    const { req, res, next } = mockReqResNext();
    await isDemo(req, res, next);
    expect(res._getStatusCode()).toBe(200);
  });
});
