import fs from 'fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRequest, createResponse } from 'node-mocks-http';
import database from '../../../server/database/connection';
import { ownerExists } from '../../../server/database/queries/user';
import config from '../../../server/utils/config';
import setupExistsMiddleware from '../../../server/middleware/setupExists';
import setupMiddleware from '../../../server/middleware/auth/setup';
import setupValidators from '../../../shared/validators/setup';

vi.mock('fs');
vi.mock('../../../server/database/connection');
vi.mock('../../../server/database/queries/user');
vi.mock('../../../server/utils/config');

describe('Setup - Middleware', () => {
  const data = {
    basic: {
      email: 'test@test.com',
      username: 'test',
      password: 'testUser123',
      databaseType: 'better-sqlite3',
      databaseName: 'test',
      migrationType: 'automatic',
    },
    advanced: {
      email: 'test@test.com',
      username: 'test',
      password: 'testUser123',
      databaseType: 'pg',
      databaseName: 'test',
      websiteUrl: 'https://lunalytics.xyz',
      migrationType: 'automatic',
      retentionPeriod: '6m',
    },
  };

  let fakeRequest;
  let fakeResponse;
  let fakeNext;
  let builders;

  beforeEach(() => {
    builders = {
      insert: vi.fn(),
      where: vi.fn().mockImplementation(() => {
        return { first: vi.fn().mockReturnValue(null) };
      }),
      update: vi.fn(),
      schema: {
        hasTable: vi.fn().mockResolvedValue(true),
      },
    };

    database.client = () => builders;
    database.connect = vi.fn().mockResolvedValue(() => builders);
    ownerExists = vi.fn().mockResolvedValue(true);
    fs.writeFileSync = vi.fn();

    fakeRequest = createRequest();
    fakeResponse = createResponse();
    fakeNext = vi.fn();

    config.get = vi.fn().mockReturnValue({ name: 'test' });

    fakeRequest.body = {
      email: 'KSJaay@lunalytics.xyz',
      password: 'testUser123',
    };
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('GET - /setup/exists', () => {
    it('should return expected response if database name is not set and request.url starts with /api', async () => {
      config.get = vi.fn().mockReturnValue(null);

      fakeRequest.url = '/api/test';
      const spy = vi.spyOn(fakeResponse, 'status');
      const jsonSpy = vi.spyOn(fakeResponse, 'json');
      await setupExistsMiddleware(fakeRequest, fakeResponse, fakeNext);

      expect(spy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith({
        success: false,
        setupRequired: true,
        message: 'Application setup required',
      });
    });

    it('should return expected response if owner does not exist and request.url starts with /api', async () => {
      ownerExists = vi.fn().mockReturnValue(false);

      fakeRequest.url = '/api/test';
      const spy = vi.spyOn(fakeResponse, 'status');
      const jsonSpy = vi.spyOn(fakeResponse, 'json');
      await setupExistsMiddleware(fakeRequest, fakeResponse, fakeNext);

      expect(spy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith({
        success: false,
        setupRequired: true,
        message: 'Application setup required',
      });
    });

    it('should call ownerExists', async () => {
      await setupExistsMiddleware(fakeRequest, fakeResponse, fakeNext);

      expect(ownerExists).toHaveBeenCalled();
    });
  });

  describe('POST - /setup', () => {
    beforeEach(() => {
      config.get = vi.fn().mockReturnValue(null);
    });

    it('should return 400 when type is not provided', async () => {
      fakeRequest.body = {};

      await setupMiddleware(fakeRequest, fakeResponse);

      expect(fakeResponse.statusCode).toEqual(400);
    });

    it('should return 400 when type is invalid', async () => {
      fakeRequest.body = { type: 'invalid' };

      await setupMiddleware(fakeRequest, fakeResponse);

      expect(fakeResponse.statusCode).toEqual(400);
    });

    it('should return 400 when email is not provided', async () => {
      fakeRequest.body = { type: 'basic' };

      await setupMiddleware(fakeRequest, fakeResponse);

      expect(fakeResponse.statusCode).toEqual(400);
    });

    it('should return 400 when username is not provided', async () => {
      fakeRequest.body = { type: 'basic', email: 'test@test.com' };

      await setupMiddleware(fakeRequest, fakeResponse);

      expect(fakeResponse.statusCode).toEqual(400);
    });

    it('should return 400 when password is not provided', async () => {
      fakeRequest.body = {
        type: 'basic',
        email: 'test@test.com',
        username: 'test',
      };

      await setupMiddleware(fakeRequest, fakeResponse);

      expect(fakeResponse.statusCode).toEqual(400);
    });

    it('should return 400 when password is less than 8 characters', async () => {
      fakeRequest.body = {
        type: 'basic',
        email: 'test@test.com',
        username: 'test',
        password: 'test',
      };

      await setupMiddleware(fakeRequest, fakeResponse);

      expect(fakeResponse.statusCode).toEqual(400);
    });

    it('should return 400 if ownerExists returns true', async () => {
      ownerExists = vi.fn().mockReturnValue(true);

      await setupMiddleware(fakeRequest, fakeResponse);

      expect(fakeResponse.statusCode).toEqual(400);
    });

    ['basic', 'advanced'].forEach((type) => {
      const typeData = data[type];

      Object.keys(typeData).forEach((key) => {
        it(`should return 400 when ${key} is not provided`, async () => {
          fakeRequest.body = {
            type,
            ...typeData,
          };
          delete fakeRequest.body[key];

          ownerExists = vi.fn().mockReturnValue(false);

          const validator = setupValidators[key];
          let results = {};

          const setErrors = (error) => {
            results = error;
          };

          validator(fakeRequest.body[key], setErrors);

          const spy = vi.spyOn(fakeResponse, 'send');
          await setupMiddleware(fakeRequest, fakeResponse);

          expect(fakeResponse.statusCode).toEqual(400);
          expect(spy).toHaveBeenCalledWith(results);
        });
      });

      it(`should return 200 when ${type} setup is successful`, async () => {
        ownerExists = vi.fn().mockReturnValue(false);

        fakeRequest.body = { type, ...typeData };

        await setupMiddleware(fakeRequest, fakeResponse);

        expect(fakeResponse.statusCode).toEqual(200);
      });
    });
  });
});
