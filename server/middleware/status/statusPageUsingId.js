import { cleanStatusPage } from '../../class/status.js';
import { fetchStatusPageUsingUrl } from '../../database/queries/status.js';
import { userExists } from '../../database/queries/user.js';

const getStatusPageUsingIdMiddleware = async (request, response, next) => {
  try {
    const statusPageId = request.params.id?.toLowerCase();

    if (statusPageId === 'default') {
      return response.redirect('/');
    }

    const statusPage = await fetchStatusPageUsingUrl(statusPageId);

    if (!statusPage) {
      return response.redirect('/404');
    }

    const parsedStatusPage = cleanStatusPage(statusPage);

    if (!parsedStatusPage.isPublic) {
      const { access_token } = request.cookies;

      if (!access_token) {
        return response.redirect('/login');
      }

      const user = await userExists(access_token);

      if (!user) {
        return response.redirect('/login');
      }
    }

    next();
  } catch (error) {
    return response.redirect('/404');
  }
};

export default getStatusPageUsingIdMiddleware;
