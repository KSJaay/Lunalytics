import { setServerSideCookie } from '../../../shared/utils/cookies.js';
import { fetchConnectionByEmail } from '../../database/queries/connection.js';
import {
  fetchInviteUsingId,
  increaseInviteUses,
} from '../../database/queries/invite.js';
import { createUserSession } from '../../database/queries/session.js';
import {
  getUserByEmail,
  registerSsoUser,
} from '../../database/queries/user.js';
import { handleError } from '../../utils/errors.js';
import { parseUserAgent } from '../../utils/uaParser.js';

const signInOrRegisterUsingAuth = async (request, response) => {
  try {
    const { avatar, id, username, email, provider } =
      response.locals.authUser || {};
    const invite = request?.query?.invite || request?.cookies?.invite;

    const connectionExists = await fetchConnectionByEmail(provider, id);

    const data = {
      email: email.toLowerCase(),
      displayName: username,
      avatar,
      sso: true,
      provider,
      id,
    };

    let userExists;

    if (!connectionExists) {
      userExists = await getUserByEmail(email);

      if (userExists) {
        return response.redirect(
          `/error?code=no_connection&provider=${provider}`
        );
      }

      if (invite) {
        const inviteData = await fetchInviteUsingId(invite);

        if (inviteData && !inviteData.paused) {
          const expiry =
            inviteData.expiresAt && new Date(inviteData.expiresAt).getTime();

          if (!expiry || expiry < Date.now()) {
            await increaseInviteUses(invite);
            data.isVerified = true;
          }
        }
      }

      await registerSsoUser(data);
    }

    userExists = await getUserByEmail(email);

    const userAgent = request.headers['user-agent'];
    const agentData = parseUserAgent(userAgent);

    const sessionToken = await createUserSession(email, agentData.device, {
      ...agentData.data,
      provider,
      accountId: id,
    });

    setServerSideCookie(
      response,
      'session_token',
      sessionToken,
      request.protocol === 'https'
    );

    if (data.isVerified || userExists.isVerified) {
      return response.redirect('/home');
    }

    return response.redirect('/verify');
  } catch (error) {
    handleError(error, response);
  }
};

export default signInOrRegisterUsingAuth;
