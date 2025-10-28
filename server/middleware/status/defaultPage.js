import { deleteCookie } from '../../../shared/utils/cookies.js';
import { cleanStatusPage } from '../../class/status.js';
import { userSessionExists } from '../../database/queries/session.js';
import { fetchStatusPageUsingUrl } from '../../database/queries/status.js';
import { getUserByEmail } from '../../database/queries/user.js';

const defaultPageMiddleware = async (request, response, next) => {
  try {
    const statusPage = await fetchStatusPageUsingUrl('default');

    if (!statusPage) {
      return response.redirect('/home');
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

    return next();
  } catch {
    return response.redirect('/home');
  }
};

export default defaultPageMiddleware;
