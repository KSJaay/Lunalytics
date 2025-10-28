import {
  cleanStatusPage,
  cleanStatusPageWithMonitors,
  cleanStatusApiResponse,
} from '../../../server/class/status.js';

describe('cleanStatusPage', () => {
  it('should merge defaultStatusValues with parsed settings and parse layout', () => {
    const status = {
      id: '1',
      statusId: 'sid',
      statusUrl: 'url',
      settings: '{"theme":"dark"}',
      layout: '["row1","row2"]',
      email: 'test@example.com',
      createdAt: '2025-10-25T10:00:00Z',
    };
    const result = cleanStatusPage(status);
    expect(result.id).toBe('1');
    expect(result.statusId).toBe('sid');
    expect(result.statusUrl).toBe('url');
    expect(result.settings.theme).toBe('dark');
    expect(Array.isArray(result.layout)).toBe(true);
    expect(result.layout).toEqual(['row1', 'row2']);
    expect(result.email).toBe('test@example.com');
    expect(result.createdAt).toBe('2025-10-25T10:00:00Z');
  });

  it('should handle malformed settings/layout JSON gracefully', () => {
    const status = {
      id: '2',
      statusId: 'sid2',
      statusUrl: 'url2',
      settings: '{bad:json}',
      layout: '[malformed',
      email: 'bad@example.com',
      createdAt: '2025-10-25T11:00:00Z',
    };
    const result = cleanStatusPage(status);
    expect(typeof result.settings).toBe('object');
    expect(result.layout).toEqual([]);
  });

  it('should handle missing optional fields', () => {
    const status = {
      id: '3',
      statusId: 'sid3',
      statusUrl: 'url3',
      settings: '{}',
      layout: '[]',
    };
    const result = cleanStatusPage(status);
    expect(result.email).toBeUndefined();
    expect(result.createdAt).toBeUndefined();
  });
});

describe('cleanStatusPageWithMonitors', () => {
  it('should merge defaultStatusValues with parsed settings and parse layout', () => {
    const status = {
      settings: '{"lang":"en"}',
      layout: '["rowA"]',
    };
    const result = cleanStatusPageWithMonitors(status);
    expect(result.settings.lang).toBe('en');
    expect(result.layout).toEqual(['rowA']);
  });

  it('should handle malformed JSON gracefully', () => {
    const status = {
      settings: '{bad:json}',
      layout: '[malformed',
    };
    const result = cleanStatusPageWithMonitors(status);
    expect(typeof result.settings).toBe('object');
    expect(result.layout).toEqual([]);
  });
});

describe('cleanStatusApiResponse', () => {
  it('should return all fields as-is', () => {
    const data = {
      id: 'id',
      statusId: 'sid',
      statusUrl: 'url',
      settings: { theme: 'light' },
      layout: ['row'],
      monitors: [1, 2],
      incidents: [3],
      heartbeats: [4],
    };
    const result = cleanStatusApiResponse(data);
    expect(result).toEqual(data);
  });
});
