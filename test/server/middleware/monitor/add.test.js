/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';
import { createRequest, createResponse } from 'node-mocks-http';

// --- 1. DEFINE MOCKS (Factory Pattern) ---

// Mock Cache
jest.mock('../../../../server/cache', () => ({
  __esModule: true,
  default: {
    checkStatus: jest.fn(),
  },
}));

// Mock Database Queries (Monitor)
jest.mock('../../../../server/database/queries/monitor', () => ({
  createMonitor: jest.fn(),
}));

// Mock Database Queries (Heartbeat)
jest.mock('../../../../server/database/queries/heartbeat', () => ({
  fetchHeartbeats: jest.fn(),
}));

// Mock Database Queries (Certificate) - FIX: Added this mock
jest.mock('../../../../server/database/queries/certificate', () => ({
  fetchCertificate: jest.fn(),
}));

// Mock SQLite Setup
jest.mock('../../../../server/database/sqlite/setup', () => ({
  __esModule: true,
  default: {
    client: jest.fn(),
  },
}));

// --- 2. IMPORT FILES ---
import monitorAdd from '../../../../server/middleware/monitor/add.js';
import cache from '../../../../server/cache';
import { createMonitor } from '../../../../server/database/queries/monitor';
import { fetchHeartbeats } from '../../../../server/database/queries/heartbeat';
import { fetchCertificate } from '../../../../server/database/queries/certificate'; // FIX: Import the mocked function

describe('Add Monitor - Middleware', () => {
  const user = {
    email: 'KSJaay@lunalytics.xyz',
    displayName: 'KSJaay',
    isVerified: false,
  };
  const session_token = 'test_token';

  let fakeRequest;
  let fakeResponse;

  beforeEach(() => {
    // Reset Mocks
    jest.clearAllMocks();

    // Default return values
    createMonitor.mockReturnValue({ monitorId: 'test' });
    fetchHeartbeats.mockResolvedValue([]);
    
    // FIX: Prevent crash when checking certificates
    fetchCertificate.mockResolvedValue([]); 

    // Setup Request/Response
    fakeRequest = createRequest();
    fakeResponse = createResponse();

    fakeRequest.cookies = { session_token };
    fakeResponse.locals = { user };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('HTTP - Add Monitor', () => {
    beforeEach(() => {
      fakeRequest.body = {
        type: 'http',
        name: 'test',
        url: 'https://lunalytics.xyz',
        interval: 60,
        email: 'KSJaay@lunalytics.xyz',
        valid_status_codes: ['200-299'],
        notificationType: 'All',
        notificationId: null,
        method: 'GET',
        headers: {},
        body: {},
        port: null,
        retryInterval: 60,
        requestTimeout: 60,
        ignoreTls: false,
        retry: 1,
        icon: {
          id: 'lunalytics',
          url: 'https://demo.lunalytics.xyz/logo.svg',
          name: 'Lunalytics',
        },
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
      it('should call createMonitor with body, email, and isHttp', async () => {
        await monitorAdd(fakeRequest, fakeResponse);

        expect(createMonitor).toHaveBeenCalledWith({
          name: fakeRequest.body.name,
          url: fakeRequest.body.url,
          interval: fakeRequest.body.interval,
          monitorId: fakeRequest.body.monitorId,
          retryInterval: fakeRequest.body.retryInterval,
          requestTimeout: fakeRequest.body.requestTimeout,
          notificationId: fakeRequest.body.notificationId,
          notificationType: fakeRequest.body.notificationType,
          parentId: null,
          headers: JSON.stringify(fakeRequest.body.headers),
          body: JSON.stringify(fakeRequest.body.body),
          email: user.email,
          method: fakeRequest.body.method,
          valid_status_codes: JSON.stringify(
            fakeRequest.body.valid_status_codes
          ),
          type: 'http',
          retry: 1,
          ignoreTls: false,
          icon: JSON.stringify({
            id: 'lunalytics',
            url: 'https://demo.lunalytics.xyz/logo.svg',
            name: 'Lunalytics',
          }),
        });
      });

      it('should call setTimeout (via cache) with monitorId', async () => {
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
        ignoreTls: false,
        retry: 1,
        icon: {
          id: 'lunalytics',
          url: 'https://demo.lunalytics.xyz/logo.svg',
          name: 'Lunalytics',
        },
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
      it('should call createMonitor with body, email, and type tcp', async () => {
        await monitorAdd(fakeRequest, fakeResponse);

        expect(createMonitor).toHaveBeenCalledWith({
          name: fakeRequest.body.name,
          url: fakeRequest.body.url,
          interval: fakeRequest.body.interval,
          monitorId: fakeRequest.body.monitorId,
          retryInterval: fakeRequest.body.retryInterval,
          requestTimeout: fakeRequest.body.requestTimeout,
          notificationId: fakeRequest.body.notificationId,
          notificationType: fakeRequest.body.notificationType,
          parentId: null,
          email: user.email,
          port: fakeRequest.body.port,
          valid_status_codes: '',
          type: 'tcp',
          ignoreTls: false,
          retry: 1,
          icon: JSON.stringify({
            id: 'lunalytics',
            url: 'https://demo.lunalytics.xyz/logo.svg',
            name: 'Lunalytics',
          }),
        });
      });

      it('should call setTimeout (via cache) with monitorId', async () => {
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