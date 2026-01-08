import { cleanMonitorForStatusPage } from '../../../../server/class/monitor/statusPage.js';

describe('cleanMonitorForStatusPage', () => {
  it('should parse and convert fields correctly', () => {
    const monitor = {
      monitorId: 's1',
      name: 'StatusPage Monitor',
      url: 'http://localhost',
      created_at: '2025-10-25T10:00:00Z',
      paused: '1',
      icon: '["icon1"]',
    };
    const result = cleanMonitorForStatusPage(monitor);
    expect(result.monitorId).toBe('s1');
    expect(result.name).toBe('StatusPage Monitor');
    expect(result.url).toBeUndefined();
    expect(result.created_at).toBe('2025-10-25T10:00:00Z');
    expect(result.paused).toBe(true);
    expect(result.icon).toEqual(['icon1']);
  });

  it('should handle paused false and empty icon', () => {
    const monitor = {
      monitorId: 's2',
      name: 'Paused False',
      url: 'http://localhost',
      created_at: '2025-10-25T11:00:00Z',
      paused: '0',
      icon: '[]',
    };
    const result = cleanMonitorForStatusPage(monitor);
    expect(result.paused).toBe(false);
    expect(result.icon).toEqual([]);
  });
});
