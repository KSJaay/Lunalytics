import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRequest, createResponse } from 'node-mocks-http';
import SQLite from '../../../../server/database/sqlite/setup';
import { userExists } from '../../../../server/database/queries/user';
import cache from '../../../../server/cache';
import monitorAdd from '../../../../server/middleware/monitor/add';

vi.mock('../../../../server/database/queries/user');
vi.mock('../../../../server/cache');

describe('Add Monitor - Middleware', () => {
  const user = {
    email: 'KSJaay@lunalytics.xyz',
    displayName: 'KSJaay',
    isVerified: false,
  };
  const access_token = 'test_token';

  let fakeRequest;
  let fakeResponse;
  let SQLiteBuilders;

  beforeEach(() => {
    SQLiteBuilders = {
      insert: vi.fn(),
      where: vi.fn().mockImplementation(() => {
        return { first: vi.fn().mockReturnValue(null) };
      }),
      update: vi.fn(),
    };

    SQLite.client = () => SQLiteBuilders;
    cache = {
      monitors: {
        addOrEdit: vi.fn().mockImplementation(() => {
          return { monitorId: 'test', interval: 60 };
        }),
      },
      heartbeats: {
        get: vi.fn().mockReturnValue([]),
      },
      certificates: {
        get: vi.fn().mockReturnValue({ isValid: false }),
      },
      checkStatus: vi.fn(),
    };

    userExists = vi.fn().mockReturnValue({ email: 'KSJaay@lunalytics.xyz' });

    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.cookies = { access_token };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('HTTP - Add Monitor', () => {
    beforeEach(() => {
      fakeRequest.body = {
        type: 'http',
        name: 'test',
        url: 'https://lunalytics.xyz',
        interval: 60,
        email: 'KSJaay@lunalytics.xyz',
        valid_status_codes: JSON.stringify(['200-299']),
        notificationType: 'All',
        notificationId: null,
        method: 'GET',
        headers: null,
        body: null,
        port: null,
        retryInterval: 60,
        requestTimeout: 60,
      };
    });

    describe('when invalid data is provided', () => {
      it('should return 422 when name is invalid', async () => {
        fakeRequest.body.name = '';

        await monitorAdd(fakeRequest, fakeResponse);

        expect(fakeResponse.statusCode).toEqual(422);
      });

      it('should return 422 when url is invalid', async () => {
        fakeRequest.body.url = '';

        await monitorAdd(fakeRequest, fakeResponse);

        expect(fakeResponse.statusCode).toEqual(422);
      });

      it('should return 422 when method is invalid', async () => {
        fakeRequest.body.method = '';

        await monitorAdd(fakeRequest, fakeResponse);

        expect(fakeResponse.statusCode).toEqual(422);
      });

      it('should return 422 when statusCodes is invalid', async () => {
        fakeRequest.body.valid_status_codes = '';

        await monitorAdd(fakeRequest, fakeResponse);

        expect(fakeResponse.statusCode).toEqual(422);
      });

      it('should return 422 when interval is invalid', async () => {
        fakeRequest.body.interval = '';

        await monitorAdd(fakeRequest, fakeResponse);

        expect(fakeResponse.statusCode).toEqual(422);
      });

      it('should return 422 when retryInterval is invalid', async () => {
        fakeRequest.body.retryInterval = '';

        await monitorAdd(fakeRequest, fakeResponse);

        expect(fakeResponse.statusCode).toEqual(422);
      });

      it('should return 422 when requestTimeout is invalid', async () => {
        fakeRequest.body.requestTimeout = '';

        await monitorAdd(fakeRequest, fakeResponse);

        expect(fakeResponse.statusCode).toEqual(422);
      });
    });

    describe('when valid data is provided', () => {
      it('should return 200 when data is valid', async () => {
        await monitorAdd(fakeRequest, fakeResponse);

        expect(userExists).toHaveBeenCalledWith(access_token);
      });

      it('should call addOrEdit with body, email, and isHttp', async () => {
        await monitorAdd(fakeRequest, fakeResponse);

        expect(cache.monitors.addOrEdit).toHaveBeenCalledWith(
          fakeRequest.body,
          user.email,
          true
        );
      });

      it('should call setTimeout with monitorId and interval', async () => {
        await monitorAdd(fakeRequest, fakeResponse);

        expect(cache.checkStatus).toHaveBeenCalledWith('test');
      });

      it('should return 200 when data is valid', async () => {
        await monitorAdd(fakeRequest, fakeResponse);

        expect(fakeResponse.statusCode).toEqual(200);
      });
    });
  });

  describe('TCP - Add Monitor', () => {
    beforeEach(() => {
      fakeRequest.body = {
        type: 'tcp',
        name: 'test',
        url: '127.0.0.1',
        interval: 60,
        email: 'KSJaay@lunalytics.xyz',
        valid_status_codes: null,
        notificationType: 'All',
        notificationId: null,
        method: null,
        headers: null,
        body: null,
        port: 2308,
        retryInterval: 60,
        requestTimeout: 60,
      };
    });

    describe('when invalid data is provided', () => {
      it('should return 422 when name is invalid', async () => {
        fakeRequest.body.name = '';

        await monitorAdd(fakeRequest, fakeResponse);

        expect(fakeResponse.statusCode).toEqual(422);
      });

      it('should return 422 when url is invalid', async () => {
        fakeRequest.body.url = '';

        await monitorAdd(fakeRequest, fakeResponse);

        expect(fakeResponse.statusCode).toEqual(422);
      });

      it('should return 422 when port is invalid', async () => {
        fakeRequest.body.port = '';

        await monitorAdd(fakeRequest, fakeResponse);

        expect(fakeResponse.statusCode).toEqual(422);
      });

      it('should return 422 when interval is invalid', async () => {
        fakeRequest.body.interval = '';

        await monitorAdd(fakeRequest, fakeResponse);

        expect(fakeResponse.statusCode).toEqual(422);
      });

      it('should return 422 when retryInterval is invalid', async () => {
        fakeRequest.body.retryInterval = '';

        await monitorAdd(fakeRequest, fakeResponse);

        expect(fakeResponse.statusCode).toEqual(422);
      });

      it('should return 422 when requestTimeout is invalid', async () => {
        fakeRequest.body.requestTimeout = '';

        await monitorAdd(fakeRequest, fakeResponse);

        expect(fakeResponse.statusCode).toEqual(422);
      });
    });

    describe('when valid data is provided', () => {
      it('should return 200 when data is valid', async () => {
        await monitorAdd(fakeRequest, fakeResponse);

        expect(userExists).toHaveBeenCalledWith(access_token);
      });

      it('should call addOrEdit with body, email, and isHttp', async () => {
        await monitorAdd(fakeRequest, fakeResponse);

        expect(cache.monitors.addOrEdit).toHaveBeenCalledWith(
          fakeRequest.body,
          user.email,
          false
        );
      });

      it('should call setTimeout with monitorId and interval', async () => {
        await monitorAdd(fakeRequest, fakeResponse);

        expect(cache.checkStatus).toHaveBeenCalledWith('test');
      });

      it('should return 200 when data is valid', async () => {
        await monitorAdd(fakeRequest, fakeResponse);

        expect(fakeResponse.statusCode).toEqual(200);
      });
    });
  });
});
