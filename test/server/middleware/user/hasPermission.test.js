import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRequest, createResponse } from 'node-mocks-http';
import { PermissionsBits } from '../../../../shared/permissions/bitFlags';
import { hasRequiredPermission } from '../../../../server/middleware/user/hasPermission';

describe('deleteAccountMiddleware - Middleware', () => {
  let fakeRequest;
  let fakeResponse;
  let fakeNext;

  beforeEach(() => {
    fakeRequest = createRequest();
    fakeResponse = createResponse();
    fakeNext = vi.fn();

    fakeResponse.locals = {
      user: {
        email: 'KSJaay@lunalytics.xyz',
        permission: PermissionsBits.ADMINISTRATOR,
      },
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return 401 if no permission is provided', async () => {
    fakeResponse.locals.user.permission = null;

    await hasRequiredPermission(PermissionsBits.ADMINISTRATOR)(
      fakeRequest,
      fakeResponse,
      fakeNext
    );

    expect(fakeResponse.statusCode).toEqual(401);
  });

  it('should return 401 if user does not have required permission', async () => {
    fakeResponse.locals.user.permission = PermissionsBits.VIEW_STATUS_PAGES;

    await hasRequiredPermission(PermissionsBits.ADMINISTRATOR)(
      fakeRequest,
      fakeResponse,
      fakeNext
    );

    expect(fakeResponse.statusCode).toEqual(401);
  });

  it('should call next if user has required permission', async () => {
    fakeResponse.locals.user.permission = PermissionsBits.ADMINISTRATOR;

    await hasRequiredPermission(PermissionsBits.ADMINISTRATOR)(
      fakeRequest,
      fakeResponse,
      fakeNext
    );

    expect(fakeNext).toHaveBeenCalled();
  });
});
