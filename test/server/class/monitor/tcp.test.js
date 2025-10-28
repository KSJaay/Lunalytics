import clean from '../../../../server/class/monitor/tcp.js';

describe('tcp clean', () => {
  it('should parse and convert fields correctly', () => {
    const monitor = {
      monitorId: 't1',
      name: 'TCP Monitor',
      url: 'tcp://localhost',
      retry: '2',
      interval: '30',
      retryInterval: '5',
      requestTimeout: '1000',
      email: 'test@example.com',
      type: 'tcp',
      port: 8080,
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
    expect(result.monitorId).toBe('t1');
    expect(result.retry).toBe(2);
    expect(result.interval).toBe(30);
    expect(result.retryInterval).toBe(5);
    expect(result.requestTimeout).toBe(1000);
    expect(result.paused).toBe(true);
    expect(result.icon).toEqual(['icon1']);
    expect(result.heartbeats).toEqual([{ status: 'ok' }]);
    expect(result.port).toBe(8080);
  });

  it('should handle missing heartbeats and parse booleans', () => {
    const monitor = {
      monitorId: 't2',
      name: 'No Heartbeats',
      url: 'tcp://localhost',
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
      monitorId: 't3',
      name: 'No Heartbeats',
      url: 'tcp://localhost',
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
