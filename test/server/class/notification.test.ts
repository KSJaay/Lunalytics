import { describe, it, expect } from 'vitest';

import {
  cleanNotification,
  stringifyNotification,
} from '../../../server/class/notification.js';

describe('server/class/notification', () => {
  describe('cleanNotification', () => {
    it('parses string data into JSON', () => {
      const result = cleanNotification({
        id: 'n1',
        workspaceId: 'w1',
        platform: 'discord',
        messageType: 'embed',
        token: 'tok',
        email: 'a@b.c',
        friendlyName: 'My Discord',
        isEnabled: '1',
        data: '{"webhook":"https://x"}',
      });

      expect(result.isEnabled).toBe(true);
      expect(result.data).toEqual({ webhook: 'https://x' });
    });

    it('passes through already-parsed object data', () => {
      const data = { foo: 'bar' };
      const result = cleanNotification({
        id: 'n1',
        workspaceId: 'w1',
        platform: 'slack',
        messageType: 'text',
        token: '',
        email: '',
        friendlyName: '',
        isEnabled: '0',
        data,
      });

      expect(result.data).toBe(data);
      expect(result.isEnabled).toBe(false);
    });

    it('returns the raw string when data is malformed JSON', () => {
      const result = cleanNotification({
        id: 'n',
        workspaceId: 'w',
        platform: 'p',
        messageType: '',
        token: '',
        email: '',
        friendlyName: '',
        isEnabled: '0',
        data: 'not-json',
      });
      expect(result.data).toBe('not-json');
    });
  });

  describe('stringifyNotification', () => {
    it('serialises data into a JSON string', () => {
      const result = stringifyNotification({
        id: 'n',
        workspaceId: 'w',
        platform: 'p',
        messageType: '',
        token: '',
        email: '',
        friendlyName: '',
        isEnabled: '1',
        data: { x: 1 },
      });
      expect(result.data).toBe('{"x":1}');
      expect(result.isEnabled).toBe(true);
    });

    it('returns null when data cannot be serialised', () => {
      const circular: any = {};
      circular.self = circular;
      const result = stringifyNotification({
        id: 'n',
        workspaceId: 'w',
        platform: 'p',
        messageType: '',
        token: '',
        email: '',
        friendlyName: '',
        isEnabled: '0',
        data: circular,
      });
      expect(result.data).toBeNull();
    });
  });
});
