import { cleanIncident } from '../../../server/class/incident.js';

describe('cleanIncident', () => {
  it('should clean and parse monitorIds and messages if they are JSON strings', () => {
    const incident = {
      incidentId: 'abc123',
      title: 'Test Incident',
      monitorIds: '["monitor1","monitor2"]',
      messages: '[{"msg":"down"},{"msg":"up"}]',
      affect: 'partial',
      status: 'investigating',
      createdAt: '2025-10-25T10:00:00Z',
      completedAt: null,
      isClosed: '1',
    };
    const result = cleanIncident(incident);
    expect(result.incidentId).toBe('abc123');
    expect(result.title).toBe('Test Incident');
    expect(result.monitorIds).toEqual(['monitor1', 'monitor2']);
    expect(result.messages).toEqual([{ msg: 'down' }, { msg: 'up' }]);
    expect(result.affect).toBe('partial');
    expect(result.status).toBe('investigating');
    expect(result.createdAt).toBe('2025-10-25T10:00:00Z');
    expect(result.completedAt).toBeNull();
    expect(result.isClosed).toBe(true);
  });

  it('should not parse monitorIds/messages if already objects', () => {
    const incident = {
      incidentId: 'id2',
      title: 'Already Parsed',
      monitorIds: ['m1', 'm2'],
      messages: [{ msg: 'ok' }],
      affect: 'none',
      status: 'resolved',
      createdAt: '2025-10-25T11:00:00Z',
      completedAt: '2025-10-25T12:00:00Z',
      isClosed: '0',
    };
    const result = cleanIncident(incident);
    expect(result.monitorIds).toEqual(['m1', 'm2']);
    expect(result.messages).toEqual([{ msg: 'ok' }]);
    expect(result.isClosed).toBe(false);
  });

  it('should handle malformed JSON gracefully', () => {
    const incident = {
      incidentId: 'id3',
      title: 'Malformed',
      monitorIds: '[malformed',
      messages: '{bad:json}',
      affect: 'major',
      status: 'error',
      createdAt: '2025-10-25T13:00:00Z',
      completedAt: null,
      isClosed: '1',
    };
    const result = cleanIncident(incident);
    expect(result.monitorIds).toBe('[malformed');
    expect(result.messages).toBe('{bad:json}');
    expect(result.isClosed).toBe(true);
  });

  it('should handle missing optional fields', () => {
    const incident = {
      incidentId: 'id4',
      title: 'Missing Fields',
      monitorIds: '[]',
      messages: '[]',
      affect: undefined,
      status: undefined,
      createdAt: undefined,
      completedAt: undefined,
      isClosed: undefined,
    };
    const result = cleanIncident(incident);
    expect(result.affect).toBeUndefined();
    expect(result.status).toBeUndefined();
    expect(result.createdAt).toBeUndefined();
    expect(result.completedAt).toBeUndefined();
    expect(result.isClosed).toBe(false);
  });
});
