// import local files
import { signInUser } from '../../database/queries/user.js';
import {
  setClientSideCookie,
  setServerSideCookie,
} from '../../../shared/utils/cookies.js';
import { handleError } from '../../utils/errors.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';
import validators from '../../../shared/validators/index.js';
import { createUserSession } from '../../database/queries/session.js';
import { parseUserAgent } from '../../utils/uaParser.js';
import { fetchDefaultWorkspace } from '../../database/queries/workspace.js';
import {
  SESSION_TOKEN,
  WORKSPACE_ID_COOKIE,
} from '../../../shared/constants/cookies.js';

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
    const workspace = await fetchDefaultWorkspace();

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

    setClientSideCookie(response, WORKSPACE_ID_COOKIE, workspace.id);

    if (!user.isVerified) {
      return response.sendStatus(418);
    }

    return response.sendStatus(200);
  } catch (error) {
    return handleError(error, response);
  }
};

export default login;
