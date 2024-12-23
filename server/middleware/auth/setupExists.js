import config from '../../utils/config.js';
import { ownerExists } from '../../database/queries/user.js';

const setupExistsMiddleware = async (request, response) => {
  try {
    const databaseName = config.get('database')?.name;

    if (!databaseName) {
      return response.send({ ownerExists: false });
    }

    const query = await ownerExists();

    return response.send({ ownerExists: !!query });
  } catch (error) {
    return response.status(400).send(error);
  }
};

export default setupExistsMiddleware;
