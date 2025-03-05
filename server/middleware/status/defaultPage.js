import { cleanStatusPage } from '../../class/status.js';
import { fetchStatusPageUsingUrl } from '../../database/queries/status.js';
import { userExists } from '../../database/queries/user.js';

const defaultPageMiddleware = async (request, response, next) => {
  try {
    const statusPage = await fetchStatusPageUsingUrl('default');

    if (!statusPage) {
      return response.redirect('/home');
    }

    const parsedStatusPage = cleanStatusPage(statusPage);

    console.log(parsedStatusPage.isPublic);

    if (!parsedStatusPage.isPublic) {
      const { access_token } = request.cookies;

      if (!access_token) {
        return response.redirect('/home');
      }

      const user = await userExists(access_token);

      if (!user) {
        return response.redirect('/home');
      }
    }

    next();
  } catch (error) {
    return response.redirect('/home');
  }
};

export default defaultPageMiddleware;
