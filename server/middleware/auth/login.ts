// import local files
import { signInUser } from '../../database/queries/user.js';
import { setServerSideCookie } from '../../../shared/utils/cookies.js';
import { handleError } from '../../utils/errors.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';
import validators from '../../../shared/validators/index.js';
import { createUserSession } from '../../database/queries/session.js';
import { parseUserAgent } from '../../utils/uaParser.js';
import { SESSION_TOKEN } from '../../../shared/constants/cookies.js';

const login = async (request, response) => {
  try {
    const { email, password } = request.body;

    const isInvalidAuth =
      validators.auth.email(email) || validators.auth.password(password);

    if (isInvalidAuth) {
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
      return response.sendStatus(418);
    }

    return response.sendStatus(200);
  } catch (error) {
    return handleError(error, response);
  }
};

export default login;
