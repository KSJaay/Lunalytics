import { describe, it, expect } from 'vitest';

import { mockReqResNext } from '../../_helpers/http.js';
import {
  hasRequiredPermission,
  memberHasPermission,
  userHasPermission,
} from '../../../server/middleware/hasPermission.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';

describe('server/middleware/hasPermission', () => {
  describe('hasRequiredPermission / userHasPermission', () => {
    it('returns 401 when user.permission is missing', () => {
      const { req, res, next } = mockReqResNext();
      hasRequiredPermission(MemberPermissionBits.VIEW_MONITORS)(req, res, next);
      expect(res._getStatusCode()).toBe(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('calls next() when permission satisfies the requirement', () => {
      const { req, res, next } = mockReqResNext();
      res.locals.user = {
        permission:
          MemberPermissionBits.VIEW_MONITORS |
          MemberPermissionBits.MANAGE_MONITORS,
      };
      hasRequiredPermission(MemberPermissionBits.VIEW_MONITORS)(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('returns 401 when permission does not satisfy the requirement', () => {
      const { req, res, next } = mockReqResNext();
      res.locals.user = { permission: MemberPermissionBits.VIEW_MONITORS };
      hasRequiredPermission(MemberPermissionBits.MANAGE_MONITORS)(
        req,
        res,
        next
      );
      expect(res._getStatusCode()).toBe(401);
    });

    it('ADMINISTRATOR bypasses the check', () => {
      const { req, res, next } = mockReqResNext();
      res.locals.user = { permission: MemberPermissionBits.ADMINISTRATOR };
      hasRequiredPermission(MemberPermissionBits.MANAGE_TEAM)(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('userHasPermission behaves identically to hasRequiredPermission', () => {
      const { req, res, next } = mockReqResNext();
      res.locals.user = { permission: MemberPermissionBits.MANAGE_TEAM };
      userHasPermission(MemberPermissionBits.MANAGE_TEAM)(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('memberHasPermission', () => {
    it('reads permission from response.locals.member', () => {
      const { req, res, next } = mockReqResNext();
      res.locals.member = { permission: MemberPermissionBits.VIEW_MONITORS };
      memberHasPermission(MemberPermissionBits.VIEW_MONITORS)(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('returns 401 when no member object is set', () => {
      const { req, res, next } = mockReqResNext();
      memberHasPermission(MemberPermissionBits.VIEW_MONITORS)(req, res, next);
      expect(res._getStatusCode()).toBe(401);
    });
  });
});
