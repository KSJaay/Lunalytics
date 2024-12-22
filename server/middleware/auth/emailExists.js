import { emailExists } from '../../database/queries/user.js';

const emailExistsMiddleware = async (request, response) => {
  const { email } = request.body;
  if (!email) return response.status(400).send('No email provided');

  const user = await emailExists(email);
  if (!user) return response.send(false);

  return response.send(true);
};

export default emailExistsMiddleware;
