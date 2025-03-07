import fs from 'fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRequest, createResponse } from 'node-mocks-http';
import SQLite from '../../../server/database/sqlite/setup';
import { setServerSideCookie } from '../../../shared/utils/cookies';
import {
  ownerExists,
  registerUser,
} from '../../../server/database/queries/user';
import config from '../../../server/utils/config';
import setupExistsMiddleware from '../../../server/middleware/setupExists';
import setupMiddleware from '../../../server/middleware/auth/setup';
import setupValidators from '../../../shared/validators/setup';

vi.mock('fs');
vi.mock('../../../server/database/sqlite/setup');
vi.mock('../../../server/database/queries/user');
vi.mock('../../../shared/utils/cookies');
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
    };

    SQLite.client = () => builders;
    // registerUser = vi.fn().mockResolvedValue('test');
    ownerExists = vi.fn().mockResolvedValue(true);
    setServerSideCookie = vi.fn();
    fs.writeFileSync = vi.fn();

    fakeRequest = createRequest();
    fakeResponse = createResponse();
    fakeNext = vi.fn();

    fakeRequest.body = {
      email: 'KSJaay@lunalytics.xyz',
      password: 'testUser123',
    };
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('GET - /setup/exists', () => {
    it('should return ownerExists: false if database name is not set', async () => {
      config.get = vi.fn().mockReturnValue(null);
      const spy = vi.spyOn(fakeResponse, 'redirect');

      await setupExistsMiddleware(fakeRequest, fakeResponse);

      expect(spy).toHaveBeenCalledWith('/setup');
    });

    it('should return ownerExists: false if database name is set but owner does not exist', async () => {
      ownerExists = vi.fn().mockReturnValue(false);

      const spy = vi.spyOn(fakeResponse, 'redirect');
      await setupExistsMiddleware(fakeRequest, fakeResponse);

      expect(spy).toHaveBeenCalledWith('/setup');
    });

    it('should return ownerExists: true if owner exists in database', async () => {
      config.get = vi.fn().mockReturnValue({ name: 'test' });

      await setupExistsMiddleware(fakeRequest, fakeResponse, fakeNext);

      expect(fakeNext).toHaveBeenCalled();
    });
  });

  describe('POST - /setup', () => {
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
