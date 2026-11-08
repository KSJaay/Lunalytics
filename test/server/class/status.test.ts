import { describe, it, expect } from 'vitest';

import {
  cleanStatusPage,
  cleanStatusPageWithMonitors,
  cleanStatusApiResponse,
} from '../../../server/class/status.js';

describe('server/class/status', () => {
  describe('cleanStatusPage', () => {
    it('parses settings + layout JSON and merges defaults', () => {
      const result = cleanStatusPage({
        id: 1,
        workspaceId: 'w',
        statusId: 's',
        statusUrl: 'u',
        settings: '{"title":"Custom"}',
        layout: '[{"type":"header"}]',
        email: 'a@b.c',
        created_at: '2024-01-01',
        lastUpdated: '2024-01-02',
      });

      expect(result.layout).toEqual([{ type: 'header' }]);
      expect(result.settings.title).toBe('Custom');
      expect(result.settings.theme).toBe('Auto');
    });

    it('returns empty layout array when JSON is malformed', () => {
      const result = cleanStatusPage({
        id: 1,
        workspaceId: 'w',
        statusId: 's',
        statusUrl: 'u',
        settings: 'not-json',
        layout: 'not-json',
        email: '',
        created_at: '',
        lastUpdated: '',
      });
      expect(result.layout).toEqual([]);
    });
  });

  describe('cleanStatusPageWithMonitors', () => {
    it('returns only settings + layout (no identity fields)', () => {
      const result = cleanStatusPageWithMonitors({
        settings: '{"title":"X"}',
        layout: '[]',
      });
      expect(Object.keys(result).sort()).toEqual(['layout', 'settings']);
    });
  });

  describe('cleanStatusApiResponse', () => {
    it('passes through every documented public field', () => {
      const input = {
        id: 1,
        workspaceId: 'w',
        statusId: 's',
        statusUrl: 'u',
        settings: {},
        layout: [],
        monitors: [],
        incidents: [],
        heartbeats: [],
        lastUpdated: '2024-01-01',
      };
      expect(cleanStatusApiResponse(input)).toEqual(input);
    });
  });
});
