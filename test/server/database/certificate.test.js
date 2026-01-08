import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  fetchCertificate,
  updateCertificate,
  deleteCertificate,
} from '../../../server/database/queries/certificate';
import database from '../../../server/database/connection';
import cleanCertificate from '../../../server/class/certificate';

vi.mock('../../../server/database/connection');

describe('Certificate - Database queries', () => {
  const certificate = {
    issuer: JSON.stringify({ C: 'US', O: "Let's Encrypt", CN: 'R3' }),
    validFrom: 'Apr 15 01:56:22 2024 GMT',
    validTill: 'Jul 14 01:56:21 2024 GMT',
    validOn: JSON.stringify(['*.vercel.app', 'vercel.app']),
    daysRemaining: 62,
  };
  const monitorId = 'test';

  let mockClient;
  let builders;
  let whereBuilders;

  beforeEach(() => {
    mockClient = (value) => {
      whereBuilders = {
        first: vi.fn().mockReturnValue(value),
        update: vi.fn(),
        del: vi.fn(),
      };

      builders = {
        insert: vi.fn(),
        where: vi.fn().mockImplementation(() => whereBuilders),
        update: vi.fn(),
      };

      const client = vi.fn().mockImplementation(() => builders);
      return () => client;
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchCertificate', () => {
    it('Should call where with the monitorId', async () => {
      database.connect = mockClient();

      const spy = vi.spyOn(builders, 'where');

      await fetchCertificate(monitorId);

      expect(spy).toHaveBeenCalledWith({ monitorId });
    });

    it('should return invalid when certificate is not found', async () => {
      database.connect = mockClient();

      const certificate = await fetchCertificate(monitorId);

      expect(certificate).toEqual({ isValid: false });
    });

    it('should return valid when certificate is found', async () => {
      database.connect = mockClient(certificate);

      const cert = await fetchCertificate(monitorId);

      expect(cert).toEqual(cleanCertificate(certificate));
    });
  });

  describe('updateCertificate', () => {
    it("should insert the certificate when once doesn't exist", async () => {
      database.connect = mockClient();
      const spy = vi.spyOn(builders, 'insert');

      await updateCertificate(monitorId, certificate);

      expect(spy).toHaveBeenCalledWith({ monitorId, ...certificate });
    });

    it('should update cert if one already exists', async () => {
      database.connect = mockClient(certificate);
      const spy = vi.spyOn(whereBuilders, 'update');

      await updateCertificate(monitorId, {
        ...certificate,
        daysRemaining: 100,
      });

      expect(spy).toHaveBeenCalledWith({
        ...certificate,
        daysRemaining: 100,
      });
    });
  });

  describe('deleteCertificate', () => {
    it('should call where with the monitorId', async () => {
      database.connect = mockClient();
      const spy = vi.spyOn(builders, 'where');

      await deleteCertificate(monitorId);

      expect(spy).toHaveBeenCalledWith({ monitorId });
    });

    it('should delete the certificate', async () => {
      database.connect = mockClient(certificate);
      const spy = vi.spyOn(whereBuilders, 'del');

      await deleteCertificate(monitorId);

      expect(spy).toHaveBeenCalled();
    });
  });
});
