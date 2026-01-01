import { deleteCookie } from '../../../shared/utils/cookies.js';
import { cleanStatusPage } from '../../class/status.js';
import { userSessionExists } from '../../database/queries/session.js';
import { getUserByEmail } from '../../database/queries/user.js';
import { fetchStatusPageUsingIdOrDomain } from '../../routes/statusApi.js';

const getStatusPageUsingIdMiddleware = async (request, response, next) => {
  try {
    const statusPageId = request.params.id?.toLowerCase();

    if (statusPageId === 'default') {
      return response.redirect('/');
    }

    const statusPage = await fetchStatusPageUsingIdOrDomain(
      statusPageId,
      request.headers.host
    );

    if (!statusPage) {
      return response.redirect('/404');
    }

    const parsedStatusPage = cleanStatusPage(statusPage);

    if (!parsedStatusPage.settings?.isPublic) {
      const { session_token } = request.cookies;

      const userSession = await userSessionExists(session_token);

      if (!userSession) {
        deleteCookie(response, 'session_token');
        return response.redirect('/home');
      }

      const userExistsInDatabase = await getUserByEmail(userSession.email);

      if (!userExistsInDatabase) {
        return response.redirect('/home');
      }
    }

    next();
  } catch {
    return response.redirect('/404');
  }
};

export default getStatusPageUsingIdMiddleware;
