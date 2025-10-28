import clean from '../../../../server/class/monitor/ping.js';

describe('ping clean', () => {
  it('should parse and convert fields correctly', () => {
    const monitor = {
      monitorId: 'p1',
      name: 'Ping Monitor',
      url: 'http://localhost',
      retry: '2',
      interval: '30',
      retryInterval: '5',
      requestTimeout: '1000',
      method: 'GET',
      headers: '{"Accept":"*/*"}',
      body: '{"data":1}',
      email: 'test@example.com',
      type: 'ping',
      notificationId: 'nid',
      notificationType: 'email',
      uptimePercentage: 100,
      averageHeartbeatLatency: 50,
      showFilters: false,
      paused: '1',
      createdAt: '2025-10-25T10:00:00Z',
      icon: '["icon1"]',
      heartbeats: [{ status: 'ok' }],
    };
    const result = clean(monitor);
    expect(result.monitorId).toBe('p1');
    expect(result.retry).toBe(2);
    expect(result.interval).toBe(30);
    expect(result.retryInterval).toBe(5);
    expect(result.requestTimeout).toBe(1000);
    expect(result.method).toBe('GET');
    expect(result.headers).toEqual({ Accept: '*/*' });
    expect(result.body).toEqual({ data: 1 });
    expect(result.paused).toBe(true);
    expect(result.icon).toEqual(['icon1']);
    expect(result.heartbeats).toEqual([{ status: 'ok' }]);
  });

  it('should handle missing heartbeats and parse booleans', () => {
    const monitor = {
      monitorId: 'p2',
      name: 'No Heartbeats',
      url: 'http://localhost',
      retry: '1',
      interval: '10',
      retryInterval: '2',
      requestTimeout: '500',
      paused: '0',
      icon: '[]',
    };
    const result = clean(monitor);
    expect(result.paused).toBe(false);
    expect(result.heartbeats).toEqual([]);
    expect(result.icon).toEqual([]);
  });

  it('should omit heartbeats if includeHeartbeats is false', () => {
    const monitor = {
      monitorId: 'p3',
      name: 'No Heartbeats',
      url: 'http://localhost',
      retry: '1',
      interval: '10',
      retryInterval: '2',
      requestTimeout: '500',
      paused: '0',
      icon: '[]',
      heartbeats: [{ status: 'ok' }],
    };
    const result = clean(monitor, false);
    expect(result.heartbeats).toBeUndefined();
  });
});
