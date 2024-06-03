import { getDemoUser } from '../database/queries/user.js';
import { setDemoCookie } from '../utils/cookies.js';

const isDemo = async (request, response, next) => {
  const { access_token } = request.cookies;

  if (process.env.IS_DEMO === 'enabled' && !access_token) {
    if (
      !request.url.startsWith('/register') &&
      !request.url.startsWith('/login')
    ) {
      const cookie = await getDemoUser();
      setDemoCookie(response, 'access_token', cookie);
      request.cookies['access_token'] = cookie;
    }
  }

  return next();
};

export default isDemo;
