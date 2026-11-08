import { describe, it, expect } from 'vitest';

import { hasAutoAdd, getMonitorIds } from '../../../server/utils/status.js';

describe('server/utils/status', () => {
  describe('hasAutoAdd', () => {
    it('returns true for a single status page with an auto-add metrics layout', () => {
      const page: any = {
        layout: [{ type: 'metrics', autoAdd: true, monitors: [] }],
      };
      expect(hasAutoAdd(page)).toBe(true);
    });

    it('returns true for a single status page with an auto-add uptime layout', () => {
      const page: any = {
        layout: [{ type: 'uptime', autoAdd: true, monitors: [] }],
      };
      expect(hasAutoAdd(page)).toBe(true);
    });

    it('returns false when no layout has autoAdd', () => {
      const page: any = {
        layout: [
          { type: 'metrics', autoAdd: false, monitors: [] },
          { type: 'uptime', autoAdd: false, monitors: [] },
        ],
      };
      expect(hasAutoAdd(page)).toBe(false);
    });

    it('returns true if any page in an array has autoAdd', () => {
      const pages: any = [
        { layout: [{ type: 'metrics', autoAdd: false }] },
        { layout: [{ type: 'uptime', autoAdd: true }] },
      ];
      expect(hasAutoAdd(pages)).toBe(true);
    });

    it('returns false for an empty array of pages', () => {
      expect(hasAutoAdd([])).toBe(false);
    });
  });

  describe('getMonitorIds', () => {
    it('extracts monitor ids from a single page (string list)', () => {
      const page: any = {
        layout: [{ monitors: ['a', 'b'] }, { monitors: ['c'] }],
      };
      expect(getMonitorIds(page)).toEqual(['a', 'b', 'c']);
    });

    it('extracts monitor ids from objects with id property', () => {
      const page: any = {
        layout: [{ monitors: [{ id: 'x' }, { id: 'y' }] }],
      };
      expect(getMonitorIds(page)).toEqual(['x', 'y']);
    });

    it('handles an array of pages', () => {
      const pages: any = [
        { layout: [{ monitors: ['a'] }] },
        { layout: [{ monitors: [{ id: 'b' }] }] },
      ];
      expect(getMonitorIds(pages)).toEqual(['a', 'b']);
    });

    it('returns an empty array when no monitors are present', () => {
      const page: any = { layout: [{ type: 'metrics' }] };
      expect(getMonitorIds(page)).toEqual([]);
    });
  });
});
