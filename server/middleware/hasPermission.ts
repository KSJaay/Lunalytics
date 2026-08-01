// import type definitions
import type { NextFunction, Request, Response } from 'express';

// import local files
import Role from '../../shared/permissions/role.js';

export const hasRequiredPermission =
  (requiredPermission: number) =>
  (_request: Request, response: Response, next: NextFunction) => {
    const { user: { permission } = {} } = response.locals;
    if (!permission) return response.sendStatus(401);

    const role = new Role('user', permission);

    if (!role.hasPermission(requiredPermission)) {
      return response.sendStatus(401);
    }

    return next();
  };

export const userHasPermission =
  (requiredPermission: number) =>
  (_request: Request, response: Response, next: NextFunction) => {
    const { user: { permission } = {} } = response.locals;
    if (!permission) {
      return response
        .status(401)
        .json({ error: 'User permission does not exist' });
    }

    const role = new Role('user', permission);

    if (!role.hasPermission(requiredPermission)) {
      return response.sendStatus(401);
    }

    return next();
  };

export const memberHasPermission =
  (requiredPermission: number) =>
  (_request: Request, response: Response, next: NextFunction) => {
    const { member: { permission } = {} } = response.locals;
    if (!permission)
      return response
        .status(401)
        .json({ error: 'Member does not permission exist' });

    const role = new Role('user', permission);

    if (!role.hasPermission(requiredPermission)) {
      return response
        .status(401)
        .json({ error: 'Member does not have required permission' });
    }

    return next();
  };
