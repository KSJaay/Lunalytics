import { approveAccess } from '../../../database/queries/user.js';

const accessApproveMiddleware = async (request, response) => {
  const { email } = request.body;

  if (!email) {
    return response.sendStatus(400);
  }

  await approveAccess(email);

  return response.sendStatus(200);
};

export default accessApproveMiddleware;
