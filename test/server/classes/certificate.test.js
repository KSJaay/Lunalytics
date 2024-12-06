import cleanCertificate from '../../../server/class/certificate';

describe('Certificate - Class', () => {
  it('should a valid clean certificate', () => {
    const certificate = {
      isValid: true,
      issuer: JSON.stringify({ C: 'US', O: "Let's Encrypt", CN: 'R3' }),
      validFrom: 'Apr 15 01:56:22 2024 GMT',
      validTill: 'Jul 14 01:56:21 2024 GMT',
      validOn: JSON.stringify(['*.vercel.app', 'vercel.app']),
      daysRemaining: 62,
      nextCheck: 1715646231877,
    };

    expect(cleanCertificate(certificate)).toEqual({
      isValid: true,
      issuer: { C: 'US', O: "Let's Encrypt", CN: 'R3' },
      validFrom: 'Apr 15 01:56:22 2024 GMT',
      validTill: 'Jul 14 01:56:21 2024 GMT',
      validOn: ['*.vercel.app', 'vercel.app'],
      daysRemaining: 62,
      nextCheck: 1715646231877,
    });
  });

  it('should a invalid clean certificate', () => {
    const certificate = { isValid: false };

    expect(cleanCertificate(certificate)).toEqual({
      isValid: false,
      issuer: '',
      validOn: '',
    });
  });
});
