/**
 * @jest-environment node
 */
import { describe, expect, it } from '@jest/globals';
import { hasAutoAdd, getMonitorIds } from '../../../server/utils/status.js'; // Adjust path

describe('Layout Utilities', () => {
  
  // --- hasAutoAdd Tests ---
  describe('hasAutoAdd', () => {
    describe('Single Status Page (Object Input)', () => {
      it('should return false if layout is empty', () => {
        const content = { layout: [] };
        expect(hasAutoAdd(content)).toBe(false);
      });

      it('should return true if layout has "metrics" with autoAdd: true', () => {
        const content = {
          layout: [
            { type: 'header', autoAdd: false },
            { type: 'metrics', autoAdd: true },
          ],
        };
        expect(hasAutoAdd(content)).toBe(true);
      });

      it('should return false if layout has "metrics" with autoAdd: false', () => {
        const content = {
          layout: [{ type: 'metrics', autoAdd: false }],
        };
        expect(hasAutoAdd(content)).toBe(false);
      });

      it('should return true for "uptime" with autoAdd: true AND graphType is NOT Basic', () => {
        const content = {
          layout: [{ type: 'uptime', graphType: 'Line', autoAdd: true }],
        };
        expect(hasAutoAdd(content)).toBe(true);
      });

      it('should return false for "uptime" with autoAdd: true BUT graphType IS Basic', () => {
        // Specific logic check: uptime + Basic is excluded even if autoAdd is true
        const content = {
          layout: [{ type: 'uptime', graphType: 'Basic', autoAdd: true }],
        };
        expect(hasAutoAdd(content)).toBe(false);
      });
    });

    describe('Multiple Status Pages (Array Input)', () => {
      it('should return false if no pages have autoAdd', () => {
        const content = [
          { layout: [{ type: 'header' }] },
          { layout: [{ type: 'uptime', graphType: 'Basic', autoAdd: true }] }, // Basic ignores autoAdd
        ];
        expect(hasAutoAdd(content)).toBe(false);
      });

      it('should return true if at least one page has a valid autoAdd item', () => {
        const content = [
          { layout: [{ type: 'header' }] },
          { layout: [{ type: 'metrics', autoAdd: true }] }, // This triggers true
        ];
        expect(hasAutoAdd(content)).toBe(true);
      });
    });
  });

  // --- getMonitorIds Tests ---
  describe('getMonitorIds', () => {
    describe('Single Status Page (Object Input)', () => {
      it('should return empty array if layout has no monitors', () => {
        const content = {
          layout: [{ type: 'header' }, { type: 'text' }],
        };
        expect(getMonitorIds(content)).toEqual([]);
      });

      it('should extract IDs from simple values (strings/numbers)', () => {
        const content = {
          layout: [
            { monitors: ['101', '102'] },
            { type: 'header' } // No monitors prop
          ],
        };
        expect(getMonitorIds(content)).toEqual(['101', '102']);
      });

      it('should extract IDs from objects (value.id)', () => {
        const content = {
          layout: [
            { monitors: [{ id: '201' }, { id: '202' }] }
          ],
        };
        expect(getMonitorIds(content)).toEqual(['201', '202']);
      });

      it('should handle mixed values (strings and objects)', () => {
        const content = {
          layout: [
            { monitors: ['301', { id: '302' }] }
          ],
        };
        expect(getMonitorIds(content)).toEqual(['301', '302']);
      });
    });

    describe('Multiple Status Pages (Array Input)', () => {
      it('should combine IDs from all status pages', () => {
        const content = [
          { layout: [{ monitors: ['A1'] }] },
          { layout: [{ monitors: ['B1', 'B2'] }] },
        ];
        expect(getMonitorIds(content)).toEqual(['A1', 'B1', 'B2']);
      });

      it('should handle pages with no monitors gracefully', () => {
        const content = [
          { layout: [{ type: 'header' }] }, // No monitors
          { layout: [{ monitors: ['C1'] }] },
        ];
        expect(getMonitorIds(content)).toEqual(['C1']);
      });
    });
  });
});