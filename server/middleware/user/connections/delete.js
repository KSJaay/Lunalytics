import { handleError } from '../../../utils/errors.js';

const deleteConnectionMiddleware = async (request, response) => {
  const { provider } = request.body;

  try {
    if (!provider) {
      return response.status(400).json({ error: 'Provider is required' });
    }

    await deleteConnection(response.locals.user.email, provider);
    response.sendStatus(204);
  } catch (error) {
    console.log(error);
    handleError(error, response);
  }
};

export default deleteConnectionMiddleware;
