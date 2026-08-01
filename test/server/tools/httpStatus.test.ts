import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import nock from 'nock';

import httpStatusCheck from '../../../server/tools/httpStatus.js';

const baseMonitor = {
  monitorId: 'mon-1',
  workspaceId: 'ws-1',
  method: 'GET',
  url: 'http://example.test/health',
  requestTimeout: 5,
  valid_status_codes: ['200-299'],
  headers: {},
  body: {},
  ignoreTls: false,
} as any;

describe('server/tools/httpStatus (http://)', () => {
  beforeEach(() => {
    nock.cleanAll();
  });
  afterEach(() => nock.cleanAll());

  it('returns isDown=false when status is in the valid range', async () => {
    nock('http://example.test').get('/health').reply(200, 'ok');
    const result = await httpStatusCheck(baseMonitor);
    expect(result.status).toBe(200);
    expect(result.isDown).toBe(false);
    expect(result.monitorId).toBe('mon-1');
  });

  it('returns isDown=true when status is outside the valid range', async () => {
    nock('http://example.test').get('/health').reply(500, 'err');
    const result = await httpStatusCheck(baseMonitor);
    expect(result.status).toBe(500);
    expect(result.isDown).toBe(true);
  });

  it('returns isDown=true and status 0 on network errors', async () => {
    nock('http://example.test')
      .get('/health')
      .replyWithError({ code: 'ECONNREFUSED', message: 'connection refused' });
    const result = await httpStatusCheck({ ...baseMonitor });
    expect(result.status).toBe(0);
    expect(result.isDown).toBe(true);
  });
});
