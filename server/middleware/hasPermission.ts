// import type definitions
import type { NextFunction, Request, Response } from 'express';

// import local files
import Role from '../../shared/permissions/role.js';

export const hasRequiredPermission =
  (requiredPermission: number) =>
  (request: Request, response: Response, next: NextFunction) => {
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
  (request: Request, response: Response, next: NextFunction) => {
    const { user: { permission } = {} } = response.locals;
    if (!permission) return response.sendStatus(401);

    const role = new Role('user', permission);

    if (!role.hasPermission(requiredPermission)) {
      return response.sendStatus(401);
    }

    return next();
  };

export const memberHasPermission =
  (requiredPermission: number) =>
  (request: Request, response: Response, next: NextFunction) => {
    const { member: { permission } = {} } = response.locals;
    if (!permission) return response.sendStatus(401);

    const role = new Role('user', permission);

    if (!role.hasPermission(requiredPermission)) {
      return response.sendStatus(401);
    }

    return next();
  };
