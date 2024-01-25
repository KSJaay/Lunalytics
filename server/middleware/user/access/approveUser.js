const { approveAccess } = require('../../../database/queries/user');

const accessApproveMiddleware = async (request, response) => {
  const { email } = request.body;

  if (!email) {
    return response.sendStatus(400);
  }

  await approveAccess(email);

  return response.sendStatus(200);
};

module.exports = accessApproveMiddleware;
