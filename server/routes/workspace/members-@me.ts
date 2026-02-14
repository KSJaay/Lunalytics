import { Request, Response, Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import authorizeWorkspace from '../../middleware/authorizeWorkspace.js';
import { fetchMember } from '../../database/queries/member.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/workspace/members/@me',
    summary: 'Get information about current member',
    description: 'Get information about current member',
    tags: ['workspace'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [
      authorizeWorkspace,
      async (_request: Request, response: Response) => {
        const { workspaceId, user } = response.locals;
        const member = await fetchMember(user.email, workspaceId);

        return response.status(200).json(member);
      },
    ],
  });
};

export default initialiseRoute;
