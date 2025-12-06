// Polyfill setImmediate for Jest
if (typeof setImmediate === "undefined") {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}

// 🔹 Mock dependencies
jest.mock('https', () => ({
  get: jest.fn(),
}));

jest.mock('../../utils/logger.js', () => ({
  error: jest.fn(),
}));

jest.mock('../../../shared/utils/object.js', () => ({
  isEmpty: jest.fn((obj) => !obj || Object.keys(obj).length === 0),
}));

// 🔹 Import module after mocks
import https from 'https';
import getCertInfo from '../checkCertificate.js';
import logger from '../../utils/logger.js';
import { isEmpty } from '../../../shared/utils/object.js';

describe('checkCertificate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns certificate info if valid certificate is returned', async () => {
    const mockCert = {
      subjectaltname: 'DNS:example.com, DNS:www.example.com',
      issuer: { O: 'Test Issuer' },
      valid_from: '2025-01-01',
      valid_to: '2025-12-31',
    };

    // Mock https.get
    https.get.mockImplementation((options, callback) => {
      const res = {
        socket: {
          getPeerCertificate: jest.fn(() => mockCert),
        },
        on: jest.fn(),
        end: jest.fn(),
      };
      callback(res);
      return {
        on: jest.fn(),
        setTimeout: jest.fn(),
        destroy: jest.fn(),
        end: jest.fn(),
      };
    });

    const result = await getCertInfo('https://example.com');
    expect(result.isValid).toBe(true);
    expect(result.issuer).toBe(JSON.stringify(mockCert.issuer));
    expect(result.validFrom).toBe(mockCert.valid_from);
    expect(result.validTill).toBe(mockCert.valid_to);
    expect(result.validOn).toBe(JSON.stringify(['example.com', 'www.example.com']));
    expect(typeof result.daysRemaining).toBe('number');
  });

  test('returns isValid false if certificate is empty', async () => {
    isEmpty.mockReturnValue(true);

    https.get.mockImplementation((options, callback) => {
      const res = {
        socket: { getPeerCertificate: jest.fn(() => ({})) },
        on: jest.fn(),
        end: jest.fn(),
      };
      callback(res);
      return {
        on: jest.fn(),
        setTimeout: jest.fn(),
        destroy: jest.fn(),
        end: jest.fn(),
      };
    });

    const result = await getCertInfo('https://example.com');
    expect(result.isValid).toBe(false);
    expect(logger.error).toHaveBeenCalled();
  });

  test('returns isValid false if https.get throws an error', async () => {
    https.get.mockImplementation(() => {
      throw new Error('network error');
    });

    const result = await getCertInfo('https://example.com');
    expect(result.isValid).toBe(false);
    expect(logger.error).toHaveBeenCalled();
  });

  test('handles request timeout', async () => {
    const mockReq = {
      on: jest.fn(),
      setTimeout: jest.fn((ms, cb) => cb()),
      destroy: jest.fn(),
      end: jest.fn(),
    };

    https.get.mockImplementation(() => mockReq);

    const result = await getCertInfo('https://example.com');
    expect(result.isValid).toBe(false);
    expect(logger.error).toHaveBeenCalled();
  });
});
