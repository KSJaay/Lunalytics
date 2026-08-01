import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockResolve, mockReverse, mockSetServers } = vi.hoisted(() => ({
  mockResolve: vi.fn(),
  mockReverse: vi.fn(),
  mockSetServers: vi.fn(),
}));

vi.mock('node:dns/promises', () => ({
  Resolver: class {
    setServers = mockSetServers;
    resolve = mockResolve;
    reverse = mockReverse;
  },
}));

import dnsStatusCheck from '../../../server/tools/dns.js';

const baseMonitor = {
  monitorId: 'dns-1',
  workspaceId: 'ws-1',
  url: 'example.com',
  dnsResolver: '1.1.1.1',
  dnsRecordType: 'A',
  port: 53,
} as any;

describe('server/tools/dns', () => {
  beforeEach(() => {
    mockResolve.mockReset();
    mockReverse.mockReset();
    mockSetServers.mockReset();
  });

  it('returns isDown=false with a resolved A record', async () => {
    mockResolve.mockResolvedValue(['1.2.3.4']);
    const result = await dnsStatusCheck(baseMonitor);
    expect(result.isDown).toBe(false);
    expect(result.message).toContain('1.2.3.4');
  });

  it('returns isDown=true when no records are returned', async () => {
    mockResolve.mockResolvedValue([]);
    const result = await dnsStatusCheck(baseMonitor);
    expect(result.isDown).toBe(true);
  });

  it('returns isDown=true when resolver throws', async () => {
    mockResolve.mockRejectedValue(new Error('NXDOMAIN'));
    const result = await dnsStatusCheck(baseMonitor);
    expect(result.isDown).toBe(true);
    expect(result.message).toContain('NXDOMAIN');
  });

  it('uses reverse() for PTR record type', async () => {
    mockReverse.mockResolvedValue(['host.example.']);
    const result = await dnsStatusCheck({
      ...baseMonitor,
      dnsRecordType: 'PTR',
    });
    expect(result.isDown).toBe(false);
    expect(result.message).toContain('host.example.');
  });
});
