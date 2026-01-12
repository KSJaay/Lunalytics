import Role from '../../shared/permissions/role.js';

export const hasRequiredPermission =
  (requiredPermission) => (request, response, next) => {
    const { user: { permission } = {} } = response.locals;
    if (!permission) return response.sendStatus(401);

    const role = new Role('user', permission);

    if (!role.hasPermission(requiredPermission)) {
      return response.sendStatus(401);
    }

    return next();
  };

export const userHasPermission =
  (requiredPermission) => (request, response, next) => {
    const { user: { permission } = {} } = response.locals;
    if (!permission) return response.sendStatus(401);

    const role = new Role('user', permission);

    if (!role.hasPermission(requiredPermission)) {
      return response.sendStatus(401);
    }

    return next();
  };

export const memberHasPermission =
  (requiredPermission) => (request, response, next) => {
    const { member: { permission } = {} } = response.locals;
    if (!permission) return response.sendStatus(401);

    const role = new Role('user', permission);

    if (!role.hasPermission(requiredPermission)) {
      return response.sendStatus(401);
    }

    return next();
  };
