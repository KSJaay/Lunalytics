import { Request, Response, Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import { fetchUserWorkspaces } from '../../database/queries/user.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/user/workspaces',
    summary: 'Get all the workspaces for current user',
    description: 'Get all the workspaces for current user',
    tags: ['user'],
    security: 'false',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [
      async (_request: Request, response: Response) => {
        const workspaces = await fetchUserWorkspaces(
          response.locals.user.email
        );

        return response.status(200).json(workspaces);
      },
    ],
  });
};

export default initialiseRoute;
