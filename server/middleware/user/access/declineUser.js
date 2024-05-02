import { declineAccess } from '../../../database/queries/user.js';

const accessDeclineMiddleware = async (request, response) => {
  const { email } = request.body;

  if (!email) {
    return response.sendStatus(400);
  }

  await declineAccess(email);

  return response.sendStatus(200);
};

export default accessDeclineMiddleware;
