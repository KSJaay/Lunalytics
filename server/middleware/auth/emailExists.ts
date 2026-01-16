import { Request, Response } from 'express';
import { getUserByEmail } from '../../database/queries/user.js';
import { handleError } from '../../utils/errors.js';
import { USER_ERRORS } from '../../../shared/constants/errors/user.js';
import { GENERAL_ERRORS } from '../../../shared/constants/errors/general.js';

const emailExistsMiddleware = async (request: Request, response: Response) => {
  try {
    const { email } = request.body;
    if (!email) return response.status(400).send(GENERAL_ERRORS.G002);

    const user = await getUserByEmail(email);
    if (!user) return response.status(404).send(USER_ERRORS.U001);

    return response.sendStatus(200);
  } catch (error) {
    handleError(error, response);
  }
};

export default emailExistsMiddleware;
