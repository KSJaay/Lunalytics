import { describe, it, expect } from 'vitest';

import { cleanMonitor } from '../../../server/class/monitor/index.js';

const baseMonitor = {
  monitorId: 'm1',
  workspaceId: 'w1',
  parentId: null,
  name: 'Example',
  url: 'https://example.com',
  retry: '3',
  interval: '60',
  retryInterval: '30',
  requestTimeout: '10',
  method: 'GET',
  headers: '{"X-A":"1"}',
  body: null,
  valid_status_codes: '["200-299"]',
  email: 'a@b.c',
  notificationId: null,
  notificationType: 'All',
  paused: '0',
  ignoreTls: '1',
  created_at: '2024-01-01',
  icon: '{"id":"x"}',
};

describe('server/class/monitor — cleanMonitor router', () => {
  it('routes http monitors through the http cleaner', () => {
    const result: any = cleanMonitor({ ...baseMonitor, type: 'http' });
    expect(result.type).toBe('http');
    expect(result.method).toBe('GET');
    expect(result.headers).toEqual({ 'X-A': '1' });
    expect(result.valid_status_codes).toEqual(['200-299']);
    expect(result.paused).toBe(false);
    expect(result.ignoreTls).toBe(true);
    expect(result.icon).toEqual({ id: 'x' });
    expect(result.retry).toBe(3);
  });

  it('falls back to http cleaner for unknown types', () => {
    const result: any = cleanMonitor({ ...baseMonitor, type: 'something-new' });
    expect(result.valid_status_codes).toEqual(['200-299']);
  });

  it('omits heartbeats when includeHeartbeats=false', () => {
    const result: any = cleanMonitor(
      { ...baseMonitor, type: 'http', heartbeats: [{ status: 1 }] },
      false
    );
    expect(result.heartbeats).toBeUndefined();
  });

  it('omits cert when includeCert=false', () => {
    const result: any = cleanMonitor(
      { ...baseMonitor, type: 'http', cert: { isValid: '1' } },
      true,
      false
    );
    expect(result.cert).toBeUndefined();
  });

  it('routes dns type through the dns cleaner (exposes dnsResolver)', () => {
    const result: any = cleanMonitor({
      ...baseMonitor,
      type: 'dns',
      dnsResolver: '1.1.1.1',
      dnsRecordType: 'A',
      port: '53',
    });
    expect(result.dnsResolver).toBe('1.1.1.1');
    expect(result.dnsRecordType).toBe('A');
    expect(result.port).toBe(53);
    expect((result as any).method).toBeUndefined();
  });

  it('routes ping/tcp/docker/gamedig/json without throwing', () => {
    for (const type of ['ping', 'tcp', 'docker', 'gamedig', 'json']) {
      const result: any = cleanMonitor({ ...baseMonitor, type });
      expect(result.monitorId).toBe('m1');
    }
  });

  it('treats type case-insensitively', () => {
    const result: any = cleanMonitor({ ...baseMonitor, type: 'HTTP' });
    expect(result.valid_status_codes).toEqual(['200-299']);
  });
});
