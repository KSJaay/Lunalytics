import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import nock from 'nock';

import jsonStatusCheck from '../../../server/tools/jsonStatus.js';

const baseMonitor = {
  monitorId: 'mon-2',
  workspaceId: 'ws-1',
  method: 'GET',
  url: 'http://api.test/data',
  requestTimeout: 5,
  headers: {},
  body: {},
  ignoreTls: false,
  json_query: [{ key: 'status', operator: '==', value: 'ok' }],
} as any;

describe('server/tools/jsonStatus', () => {
  beforeEach(() => nock.cleanAll());
  afterEach(() => nock.cleanAll());

  it('passes when JSON query matches', async () => {
    nock('http://api.test').get('/data').reply(200, { status: 'ok' });
    const result = await jsonStatusCheck(baseMonitor);
    expect(result.isDown).toBe(false);
    expect(result.status).toBe(200);
  });

  it('fails when JSON query does not match', async () => {
    nock('http://api.test').get('/data').reply(200, { status: 'bad' });
    const result = await jsonStatusCheck(baseMonitor);
    expect(result.isDown).toBe(true);
  });

  it('returns isDown true when the request errors', async () => {
    nock('http://api.test')
      .get('/data')
      .replyWithError({ code: 'ECONNREFUSED', message: 'fail' });
    const result = await jsonStatusCheck(baseMonitor);
    expect(result.isDown).toBe(true);
    expect(result.status).toBe(0);
  });

  it('handles >= numeric comparison', async () => {
    nock('http://api.test').get('/data').reply(200, { count: 10 });
    const result = await jsonStatusCheck({
      ...baseMonitor,
      json_query: [{ key: 'count', operator: '>=', value: '5' }],
    });
    expect(result.isDown).toBe(false);
  });
});
