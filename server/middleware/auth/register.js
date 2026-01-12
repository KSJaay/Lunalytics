// import local files
import config from '../../utils/config.js';
import { registerUser } from '../../database/queries/user.js';
import {
  setClientSideCookie,
  setServerSideCookie,
} from '../../../shared/utils/cookies.js';
import { handleError } from '../../utils/errors.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';
import validators from '../../../shared/validators/index.js';
import { createUserSession } from '../../database/queries/session.js';
import { parseUserAgent } from '../../utils/uaParser.js';
import {
  fetchInviteUsingId,
  increaseInviteUses,
} from '../../database/queries/invite.js';
import {
  SESSION_TOKEN,
  WORKSPACE_ID_COOKIE,
} from '../../../shared/constants/cookies.js';
import { createMember } from '../../database/queries/member.js';

const register = async (request, response) => {
  try {
    if (!config.get('register')) {
      return response.status(403).send('Registration is disabled.');
    }

    const { email, username, password } = request.body;
    const invite = request?.query?.invite || request?.cookies?.invite;

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
      created_at: new Date().toISOString(),
    };

    if (invite) {
      const inviteData = await fetchInviteUsingId(invite);

      if (inviteData && !inviteData.paused) {
        const expiry =
          inviteData.expiresAt && new Date(inviteData.expiresAt).getTime();

        if (!expiry || expiry < Date.now()) {
          await increaseInviteUses(invite);
          data.isVerified = true;
          data.workspaceId = inviteData.workspaceId;
        }
      }
    }

    if (data.workspaceId) {
      await createMember(data);
      setClientSideCookie(response, WORKSPACE_ID_COOKIE, data.workspaceId);
    }

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
      SESSION_TOKEN,
      sessionToken,
      request.protocol === 'https'
    );

    if (data.isVerified) {
      return response.sendStatus(201);
    }

    return response.sendStatus(200);
  } catch (error) {
    return handleError(error, response);
  }
};

export default register;
