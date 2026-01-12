import express from 'express';
import { fetchMember } from '../database/queries/member.js';
import memberMonitorsMiddleware from '../middleware/member/monitors.js';
import { memberHasPermission } from '../middleware/hasPermission.js';
import { MemberPermissionBits } from '../../shared/permissions/bitFlags.js';

const router = express.Router();

router.get('/', async (request, response) => {
  const { workspaceId, user } = response.locals;
  const member = await fetchMember(user.email, workspaceId);

  return response.status(200).json(member);
});

router.get(
  '/monitors',
  memberHasPermission(MemberPermissionBits.VIEW_MONITORS),
  memberMonitorsMiddleware
);

export default router;
