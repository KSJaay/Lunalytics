import express from 'express';

import { createWorkspace } from '../database/queries/workspace.js';
import { createMember, fetchMember } from '../database/queries/member.js';
import { setClientSideCookie } from '../../shared/utils/cookies.js';
import { WORKSPACE_ID_COOKIE } from '../../shared/constants/cookies.js';
import { handleError } from '../utils/errors.js';
import { memberHasPermission } from '../middleware/hasPermission.js';
import authorizeWorkspace from '../middleware/authorizeWorkspace.js';
import { MemberPermissionBits } from '../../shared/permissions/bitFlags.js';
import workspaceNotificationsMiddleware from '../middleware/workspace/notifications.js';
import workspaceMonitorsMiddleware from '../middleware/workspace/monitors.js';
import getAllIncidents from '../middleware/incident/getAll.js';
import workspaceApiTokensMiddleware from '../middleware/workspace/api_tokens.js';
import teamMembersListMiddleware from '../middleware/user/team/members.js';
import getAllStatusPagesMiddleware from '../middleware/workspace/status-pages.js';

const router = express.Router();

router.post('/create', async (request, response) => {
  try {
    const { name, icon } = request.body;

    if (!name) {
      return response.status(400).send('Workspace name is required.');
    }

    if (name.length > 32) {
      return response
        .status(400)
        .send('Workspace name must be less than 32 characters.');
    }

    const workspace = await createWorkspace(
      name,
      icon,
      response.locals.user.email
    );

    await createMember({
      email: response.locals.user.email,
      workspaceId: workspace.id,
    });

    setClientSideCookie(response, WORKSPACE_ID_COOKIE, workspace.id);

    return response.status(201).send('Workspace created successfully.');
  } catch (error) {
    handleError(error, response);
  }
});

router.get('/members/@me', authorizeWorkspace, async (request, response) => {
  const { workspaceId, user } = response.locals;
  const member = await fetchMember(user.email, workspaceId);

  return response.status(200).json(member);
});

router.get(
  '/monitors',
  authorizeWorkspace,
  memberHasPermission(MemberPermissionBits.VIEW_MONITORS),
  workspaceMonitorsMiddleware
);

router.get(
  '/notifications',
  authorizeWorkspace,
  memberHasPermission(MemberPermissionBits.VIEW_NOTIFICATIONS),
  workspaceNotificationsMiddleware
);

router.get(
  '/incidents',
  authorizeWorkspace,
  memberHasPermission(MemberPermissionBits.VIEW_INCIDENTS),
  getAllIncidents
);

router.get(
  '/status-pages',
  authorizeWorkspace,
  memberHasPermission(MemberPermissionBits.VIEW_STATUS_PAGES),
  getAllStatusPagesMiddleware
);
router.get(
  '/api-tokens',
  authorizeWorkspace,
  memberHasPermission(MemberPermissionBits.ADMINISTRATOR),
  workspaceApiTokensMiddleware
);

router.get('/members', authorizeWorkspace, teamMembersListMiddleware);

export default router;
