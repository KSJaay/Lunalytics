import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventEmitter } from 'events';

const { mockGet } = vi.hoisted(() => ({ mockGet: vi.fn() }));

vi.mock('https', () => ({
  default: { get: mockGet },
  get: mockGet,
}));

import getCertInfo from '../../../server/tools/checkCertificate.js';

const makeReq = () => {
  const req = new EventEmitter() as any;
  req.setTimeout = vi.fn();
  req.destroy = vi.fn();
  req.end = vi.fn();
  return req;
};

const makeImpl = (handler: (res: any) => any) => {
  return (...args: any[]) => {
    const cb = args.find((a) => typeof a === 'function');
    const req = makeReq();
    if (cb) cb(handler(req));
    return req;
  };
};

describe('server/tools/checkCertificate', () => {
  beforeEach(() => mockGet.mockReset());

  it('returns isValid:true with parsed cert info', async () => {
    const cert = {
      issuer: { CN: 'Test CA' },
      valid_from: new Date(Date.now() - 86400000).toUTCString(),
      valid_to: new Date(Date.now() + 30 * 86400000).toUTCString(),
      subjectaltname: 'DNS:example.com, DNS:www.example.com',
    };
    mockGet.mockImplementation(
      makeImpl(() => ({ socket: { getPeerCertificate: () => cert } }))
    );

    const info: any = await getCertInfo('https://example.com');
    expect(info.isValid).toBe(true);
    expect(info.issuer).toContain('Test CA');
    expect(info.daysRemaining).toBeGreaterThan(0);
  });

  it('returns isValid:false when site does not provide a cert', async () => {
    mockGet.mockImplementation(
      makeImpl(() => ({ socket: { getPeerCertificate: () => ({}) } }))
    );
    const info: any = await getCertInfo('https://example.com');
    expect(info.isValid).toBe(false);
  });

  it('returns isValid:false when request errors', async () => {
    mockGet.mockImplementation((...args: any[]) => {
      const req = makeReq();
      req.once('newListener', (event: string, _listener: any) => {
        if (event === 'error') {
          queueMicrotask(() => req.emit('error', new Error('boom')));
        }
      });
      return req;
    });
    const info: any = await getCertInfo('https://example.com');
    expect(info.isValid).toBe(false);
  });
});
