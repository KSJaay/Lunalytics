import clean from '../../../../server/class/monitor/json.js';

describe('json clean', () => {
  it('should parse and convert fields correctly', () => {
    const monitor = {
      monitorId: 'j1',
      name: 'JSON Monitor',
      url: 'http://localhost',
      retry: '2',
      interval: '30',
      retryInterval: '5',
      requestTimeout: '1000',
      method: 'POST',
      headers: '{"Content-Type":"application/json"}',
      body: '{"data":2}',
      email: 'test@example.com',
      type: 'json',
      notificationId: 'nid',
      notificationType: 'email',
      uptimePercentage: 100,
      averageHeartbeatLatency: 50,
      showFilters: false,
      paused: '1',
      ignoreTls: '1',
      json_query: '["$.status"]',
      created_at: '2025-10-25T10:00:00Z',
      icon: '["icon1"]',
      heartbeats: [{ status: 'ok' }],
      cert: { valid: true },
    };
    const result = clean(monitor);
    expect(result.monitorId).toBe('j1');
    expect(result.retry).toBe(2);
    expect(result.interval).toBe(30);
    expect(result.retryInterval).toBe(5);
    expect(result.requestTimeout).toBe(1000);
    expect(result.method).toBe('POST');
    expect(result.headers).toEqual({ 'Content-Type': 'application/json' });
    expect(result.body).toEqual({ data: 2 });
    expect(result.json_query).toEqual(['$.status']);
    expect(result.paused).toBe(true);
    expect(result.ignoreTls).toBe(true);
    expect(result.icon).toEqual(['icon1']);
    expect(result.heartbeats).toEqual([{ status: 'ok' }]);
  });

  it('should handle missing heartbeats/cert and parse booleans', () => {
    const monitor = {
      monitorId: 'j2',
      name: 'No Heartbeats',
      url: 'http://localhost',
      retry: '1',
      interval: '10',
      retryInterval: '2',
      requestTimeout: '500',
      paused: '0',
      ignoreTls: '0',
      json_query: '[]',
      icon: '[]',
    };
    const result = clean(monitor);
    expect(result.paused).toBe(false);
    expect(result.ignoreTls).toBe(false);
    expect(result.heartbeats).toEqual([]);
    expect(result.icon).toEqual([]);
    expect(result.cert).toEqual({ isValid: false });
    expect(result.json_query).toEqual([]);
  });

  it('should omit heartbeats/cert if includeHeartbeats/includeCert is false', () => {
    const monitor = {
      monitorId: 'j3',
      name: 'No Heartbeats',
      url: 'http://localhost',
      retry: '1',
      interval: '10',
      retryInterval: '2',
      requestTimeout: '500',
      paused: '0',
      ignoreTls: '0',
      json_query: '[]',
      icon: '[]',
      heartbeats: [{ status: 'ok' }],
      cert: { valid: true },
    };
    const result = clean(monitor, false, false);
    expect(result.heartbeats).toBeUndefined();
    expect(result.cert).toBeUndefined();
  });
});
