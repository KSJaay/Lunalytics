import { describe, it, expect } from 'vitest';

import { useTestDatabase } from '../../_helpers/db.js';
import { authenticate } from '../../_helpers/auth.js';
import { mockReqResNext } from '../../_helpers/http.js';
import authorizeWorkspace from '../../../server/middleware/authorizeWorkspace.js';
import {
  WORKSPACE_ID_COOKIE,
  WORKSPACE_ID_HEADER,
} from '../../../shared/constants/cookies.js';
import { WORKSPACE_ERRORS } from '../../../shared/constants/errors/workspace.js';

useTestDatabase();

describe('server/middleware/authorizeWorkspace', () => {
  it('returns 400 W004 when no workspace id is provided', async () => {
    const { req, res, next } = mockReqResNext({});
    await authorizeWorkspace(req, res, next);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData().code).toBe(WORKSPACE_ERRORS.W004.code);
  });

  it('returns 404 W001 when the workspace id is unknown', async () => {
    const { req, res, next } = mockReqResNext({
      cookies: {
        [WORKSPACE_ID_COOKIE]: '00000000-0000-7000-8000-000000000000',
      },
    });
    res.locals.user = { email: 'a@b.c' };
    await authorizeWorkspace(req, res, next);
    expect(res._getStatusCode()).toBe(404);
    expect(res._getJSONData().code).toBe(WORKSPACE_ERRORS.W001.code);
  });

  it('returns 403 W003 when the user is not a member of the workspace', async () => {
    const ctx = await authenticate();
    const { req, res, next } = mockReqResNext({
      cookies: { [WORKSPACE_ID_COOKIE]: ctx.workspace.id },
    });
    res.locals.user = { email: 'outsider@x' };
    await authorizeWorkspace(req, res, next);
    expect(res._getStatusCode()).toBe(403);
    expect(res._getJSONData().code).toBe(WORKSPACE_ERRORS.W003.code);
  });

  it('passes when user is a member; sets locals.member and locals.workspaceId', async () => {
    const ctx = await authenticate();
    const { req, res, next } = mockReqResNext({
      headers: { [WORKSPACE_ID_HEADER]: ctx.workspace.id },
    });
    res.locals.user = { email: ctx.user.email };
    await authorizeWorkspace(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.locals.workspaceId).toBe(ctx.workspace.id);
    expect(res.locals.member.email).toBe(ctx.user.email);
  });
});
