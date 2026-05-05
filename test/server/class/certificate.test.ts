import { describe, it, expect } from 'vitest';

import cleanCertificate from '../../../server/class/certificate.js';

describe('server/class/certificate', () => {
  it('returns isValid:false when no certificate is given', () => {
    expect(cleanCertificate(null)).toEqual({ isValid: false });
    expect(cleanCertificate(undefined)).toEqual({ isValid: false });
  });

  it('returns isValid:false when certificate.isValid is falsy', () => {
    expect(cleanCertificate({ isValid: 0 })).toEqual({ isValid: false });
    expect(cleanCertificate({ isValid: false })).toEqual({ isValid: false });
  });

  it('parses issuer and validOn JSON strings into arrays', () => {
    const result = cleanCertificate({
      isValid: '1',
      issuer: '[{"CN":"Example"}]',
      validFrom: '2024-01-01',
      validTill: '2025-01-01',
      validOn: '["example.com","www.example.com"]',
      daysRemaining: 100,
      nextCheck: '2024-06-01',
    });

    expect(result).toEqual({
      isValid: true,
      issuer: [{ CN: 'Example' }],
      validFrom: '2024-01-01',
      validTill: '2025-01-01',
      validOn: ['example.com', 'www.example.com'],
      daysRemaining: 100,
      nextCheck: '2024-06-01',
    });
  });

  it('falls back to empty arrays for malformed JSON', () => {
    const result = cleanCertificate({
      isValid: '1',
      issuer: 'not-json',
      validOn: 'also-not-json',
    });

    expect(result.issuer).toEqual([]);
    expect(result.validOn).toEqual([]);
  });
});
