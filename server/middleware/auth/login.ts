// import type definitions
import type { Request, Response } from 'express';

// import local files
import { signInUser } from '../../database/queries/user.js';
import { setServerSideCookie } from '../../../shared/utils/cookies.js';
import { handleError } from '../../utils/errors.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';
import validators from '../../../shared/validators/index.js';
import { createUserSession } from '../../database/queries/session.js';
import { parseUserAgent } from '../../utils/uaParser.js';
import { SESSION_TOKEN } from '../../../shared/constants/cookies.js';
import { USER_ERRORS } from '../../../shared/constants/errors/user.js';

const login = async (request: Request, response: Response) => {
  try {
    const { email, password } = request.body;

    const isInvalidAuth =
      validators.auth.email(email) || validators.auth.password(password);

    if (isInvalidAuth && isInvalidAuth.isValidationError) {
      throw new UnprocessableError(isInvalidAuth);
    }

    const userAgent = request.headers['user-agent'];
    const agentData = parseUserAgent(userAgent);

    const user = await signInUser(email.toLowerCase(), password);

    const userSession = await createUserSession(
      user.email,
      agentData.device,
      agentData.data
    );

    setServerSideCookie(
      response,
      SESSION_TOKEN,
      userSession,
      request.protocol === 'https'
    );

    if (!user.isVerified) {
      return response.status(400).send(USER_ERRORS.U006);
    }

    return response.sendStatus(200);
  } catch (error) {
    return handleError(error, response);
  }
};

export default login;
