import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import { fetchApplicationWorkspaces } from '../../database/queries/admin.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/admin/workspaces',
    summary: 'Get a list of all the workspaces',
    description: 'Get a list of all the workspaces',
    tags: ['admin'],
    security: '1',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [
      async (_request, response) => {
        return response
          .status(200)
          .json({ workspaces: await fetchApplicationWorkspaces() });
      },
    ],
  });
};

export default initialiseRoute;
