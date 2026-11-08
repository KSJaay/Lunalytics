import { Request, Response, Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import {
  fetchInviteUsingId,
  increaseInviteUses,
} from '../../database/queries/invite.js';
import { createMember, fetchMember } from '../../database/queries/member.js';
import { setClientSideCookie } from '../../../shared/utils/cookies.js';
import { WORKSPACE_ID_COOKIE } from '../../../shared/constants/cookies.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'put',
    path: '/api/workspace/join',
    summary: 'Add a user to the workspace',
    description: 'Add a user to the workspace',
    tags: ['workspace'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [
      async (request: Request, response: Response) => {
        const { inviteCode } = request.body;
        const { email } = response.locals.user;

        if (!inviteCode) {
          return response
            .status(400)
            .json({ message: 'Invite code is required' });
        }

        const inviteExists = await fetchInviteUsingId(inviteCode);

        if (!inviteExists) {
          return response.status(404).json({ message: 'Invite not found' });
        }

        const memberExists = await fetchMember(email, inviteExists.workspaceId);

        if (memberExists) {
          setClientSideCookie(
            response,
            WORKSPACE_ID_COOKIE,
            inviteExists.workspaceId
          );

          return response.status(400).json({
            message: 'User is already a member of the workspace',
          });
        }

        await createMember({
          email,
          workspaceId: inviteExists.workspaceId,
          permission: inviteExists.permission,
        });

        await increaseInviteUses(inviteCode);

        setClientSideCookie(
          response,
          WORKSPACE_ID_COOKIE,
          inviteExists.workspaceId
        );

        return response
          .status(200)
          .json({ message: 'Joined workspace successfully' });
      },
    ],
  });
};

export default initialiseRoute;
