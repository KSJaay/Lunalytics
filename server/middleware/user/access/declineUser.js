const { declineAccess } = require('../../../database/queries/user');

const accessDeclineMiddleware = async (request, response) => {
  const { email } = request.body;

  if (!email) {
    return response.sendStatus(400);
  }

  await declineAccess(email);

  return response.sendStatus(200);
};

module.exports = accessDeclineMiddleware;
