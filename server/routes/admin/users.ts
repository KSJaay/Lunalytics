import { Router } from 'express';
import { createRoute } from '../../utils/createRoute.js';
import { fetchApplicationUsers } from '../../database/queries/admin.js';

const initialiseRoute = (router: Router) => {
  createRoute(router, {
    method: 'get',
    path: '/api/admin/users',
    summary: 'Get a list of all the users registered',
    description: 'Get a list of all the users registered',
    tags: ['admin'],
    security: '1',
    deprecated: false,
    validations: {},
    responses: [],
    middlewares: [
      async (request, response, next) => {
        const users = await fetchApplicationUsers();

        return response.status(200).json({ users });
      },
    ],
  });
};

export default initialiseRoute;
