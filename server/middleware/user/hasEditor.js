const { userExists } = require('../../database/queries/user');

const hasEditorPermissions = async (request, response, next) => {
  const { access_token } = request.cookies;

  if (!access_token) {
    return response.sendStatus(401);
  }

  const user = await userExists(access_token);

  if (!user) {
    return response.sendStatus(401);
  }

  if (user.permission !== 1 && user.permission !== 2 && user.permission !== 3) {
    return response.sendStatus(401);
  }

  return next();
};

module.exports = hasEditorPermissions;
