import clean from '../../../../server/class/monitor/docker.js';

describe('docker clean', () => {
  it('should parse and convert fields correctly', () => {
    const monitor = {
      monitorId: 'm1',
      name: 'Docker Monitor',
      url: 'http://localhost',
      retry: '3',
      interval: '60',
      retryInterval: '10',
      requestTimeout: '5000',
      email: 'test@example.com',
      type: 'docker',
      notificationId: 'nid',
      notificationType: 'email',
      uptimePercentage: 99.9,
      averageHeartbeatLatency: 100,
      showFilters: true,
      paused: '1',
      ignoreTls: '1',
      createdAt: '2025-10-25T10:00:00Z',
      icon: '["icon1"]',
      heartbeats: [{ status: 'ok' }],
    };
    const result = clean(monitor);
    expect(result.monitorId).toBe('m1');
    expect(result.retry).toBe(3);
    expect(result.interval).toBe(60);
    expect(result.retryInterval).toBe(10);
    expect(result.requestTimeout).toBe(5000);
    expect(result.paused).toBe(true);
    expect(result.ignoreTls).toBe(true);
    expect(result.icon).toEqual(['icon1']);
    expect(result.heartbeats).toEqual([{ status: 'ok' }]);
  });

  it('should handle missing heartbeats and parse booleans', () => {
    const monitor = {
      monitorId: 'm2',
      name: 'No Heartbeats',
      url: 'http://localhost',
      retry: '1',
      interval: '30',
      retryInterval: '5',
      requestTimeout: '1000',
      paused: '0',
      ignoreTls: '0',
      icon: '[]',
    };
    const result = clean(monitor);
    expect(result.paused).toBe(false);
    expect(result.ignoreTls).toBe(false);
    expect(result.heartbeats).toEqual([]);
    expect(result.icon).toEqual([]);
  });

  it('should omit heartbeats if includeHeartbeats is false', () => {
    const monitor = {
      monitorId: 'm3',
      name: 'No Heartbeats',
      url: 'http://localhost',
      retry: '1',
      interval: '30',
      retryInterval: '5',
      requestTimeout: '1000',
      paused: '0',
      ignoreTls: '0',
      icon: '[]',
      heartbeats: [{ status: 'ok' }],
    };
    const result = clean(monitor, false);
    expect(result.heartbeats).toBeUndefined();
  });
});
