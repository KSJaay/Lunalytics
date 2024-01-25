const {
  userExists,
  updateUserPermission,
} = require('../../../database/queries/user');

const permissionUpdateMiddleware = async (request, response) => {
  const { access_token } = request.cookies;

  if (!access_token) {
    return response.sendStatus(401);
  }

  const user = await userExists(access_token);

  if (!user) {
    return response.sendStatus(401);
  }

  if (user.permission !== 1 && user.permission !== 2) {
    return response.sendStatus(401);
  }

  const { email, permission } = request.body;

  if (user.permission >= permission) {
    return response.status(400).send('You cannot change this user permission.');
  }

  if (![1, 2, 3, 4].includes(permission)) {
    return response.sendStatus(400);
  }

  if (!email) {
    return response.sendStatus(400);
  }

  await updateUserPermission(email, permission);

  return response.sendStatus(200);
};

module.exports = permissionUpdateMiddleware;
