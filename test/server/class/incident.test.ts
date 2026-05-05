import { describe, it, expect } from 'vitest';

import { cleanIncident } from '../../../server/class/incident.js';

describe('server/class/incident', () => {
  it('parses JSON-encoded fields', () => {
    const result = cleanIncident({
      title: 'Outage',
      incidentId: 'inc1',
      workspaceId: 'ws1',
      affect: 'monitor',
      status: 'investigating',
      messages: '[{"text":"hi"}]',
      monitorIds: '["m1","m2"]',
      created_at: '2024-01-01',
      completedAt: null,
      isClosed: '0',
    });

    expect(result.monitorIds).toEqual(['m1', 'm2']);
    expect(result.messages).toEqual([{ text: 'hi' }]);
    expect(result.isClosed).toBe(false);
  });

  it('returns objects unchanged when already parsed', () => {
    const parsed = [{ id: 'a' }];
    const result = cleanIncident({
      title: 't',
      incidentId: 'i',
      workspaceId: 'w',
      affect: 'monitor',
      status: 'open',
      messages: parsed,
      monitorIds: parsed,
      created_at: '',
      completedAt: '',
      isClosed: '1',
    });

    expect(result.messages).toBe(parsed);
    expect(result.monitorIds).toBe(parsed);
    expect(result.isClosed).toBe(true);
  });

  it('preserves the original string when JSON is malformed', () => {
    const result = cleanIncident({
      title: 't',
      incidentId: 'i',
      workspaceId: 'w',
      affect: '',
      status: '',
      messages: 'not-json',
      monitorIds: 'not-json',
      created_at: '',
      completedAt: '',
      isClosed: '0',
    });

    expect(result.messages).toBe('not-json');
    expect(result.monitorIds).toBe('not-json');
  });
});
