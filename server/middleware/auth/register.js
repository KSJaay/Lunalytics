// import local files
import { registerUser } from '../../database/queries/user.js';
import { setServerSideCookie } from '../../../shared/utils/cookies.js';
import { handleError } from '../../utils/errors.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';
import validators from '../../../shared/validators/index.js';
import { createUserSession } from '../../database/queries/session.js';
import { parseUserAgent } from '../../utils/uaParser.js';

const register = async (request, response) => {
  try {
    const { email, username, password } = request.body;

    const isInvalidAuth =
      validators.auth.email(email) ||
      validators.auth.username(username) ||
      validators.auth.password(password);

    if (isInvalidAuth) {
      throw new UnprocessableError(isInvalidAuth);
    }

    const data = {
      email: email.toLowerCase(),
      displayName: username,
      password,
      avatar: null,
      createdAt: new Date().toISOString(),
    };

    await registerUser(data);

    const userAgent = request.headers['user-agent'];
    const agentData = parseUserAgent(userAgent);

    const sessionToken = await createUserSession(
      data.email,
      agentData.device,
      agentData.data
    );

    setServerSideCookie(
      response,
      'session_token',
      sessionToken,
      request.protocol === 'https'
    );

    return response.sendStatus(200);
  } catch (error) {
    return handleError(error, response);
  }
};

export default register;
