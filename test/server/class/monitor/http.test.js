import clean from '../../../../server/class/monitor/http.js';

describe('http clean', () => {
  it('should parse and convert fields correctly', () => {
    const monitor = {
      monitorId: 'h1',
      name: 'HTTP Monitor',
      url: 'http://localhost',
      retry: '2',
      interval: '30',
      retryInterval: '5',
      requestTimeout: '1000',
      method: 'GET',
      headers: '{"Accept":"*/*"}',
      body: '{"data":1}',
      valid_status_codes: '["200-299"]',
      email: 'test@example.com',
      type: 'http',
      notificationId: 'nid',
      notificationType: 'email',
      uptimePercentage: 100,
      averageHeartbeatLatency: 50,
      showFilters: false,
      paused: '1',
      ignoreTls: '1',
      createdAt: '2025-10-25T10:00:00Z',
      icon: '["icon1"]',
      heartbeats: [{ status: 'ok' }],
      cert: { valid: true },
    };
    const result = clean(monitor);
    expect(result.monitorId).toBe('h1');
    expect(result.retry).toBe(2);
    expect(result.interval).toBe(30);
    expect(result.retryInterval).toBe(5);
    expect(result.requestTimeout).toBe(1000);
    expect(result.method).toBe('GET');
    expect(result.headers).toEqual({ Accept: '*/*' });
    expect(result.body).toEqual({ data: 1 });
    expect(result.valid_status_codes).toEqual(['200-299']);
    expect(result.paused).toBe(true);
    expect(result.ignoreTls).toBe(true);
    expect(result.icon).toEqual(['icon1']);
    expect(result.heartbeats).toEqual([{ status: 'ok' }]);
  });

  it('should handle missing heartbeats and cert, and parse booleans', () => {
    const monitor = {
      monitorId: 'h2',
      name: 'No Heartbeats',
      url: 'http://localhost',
      retry: '1',
      interval: '10',
      retryInterval: '2',
      requestTimeout: '500',
      paused: '0',
      ignoreTls: '0',
      icon: '[]',
    };
    const result = clean(monitor);
    expect(result.paused).toBe(false);
    expect(result.ignoreTls).toBe(false);
    expect(result.heartbeats).toEqual([]);
    expect(result.icon).toEqual([]);
    expect(result.cert).toEqual({ isValid: false });
  });

  it('should omit heartbeats/cert if includeHeartbeats/includeCert is false', () => {
    const monitor = {
      monitorId: 'h3',
      name: 'No Heartbeats',
      url: 'http://localhost',
      retry: '1',
      interval: '10',
      retryInterval: '2',
      requestTimeout: '500',
      paused: '0',
      ignoreTls: '0',
      icon: '[]',
      heartbeats: [{ status: 'ok' }],
      cert: { valid: true },
    };
    const result = clean(monitor, false, false);
    expect(result.heartbeats).toBeUndefined();
    expect(result.cert).toBeUndefined();
  });
});
