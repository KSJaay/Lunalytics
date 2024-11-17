import { getDemoUser } from '../database/queries/user.js';
import { setDemoCookie } from '../../shared/utils/cookies.js';
import config from '../utils/config.js';

const isDemoMode = config.get('isDemo');

const isDemo = async (request, response, next) => {
  const { access_token } = request.cookies;

  if (process.env.NODE_ENV === 'production' && isDemoMode && !access_token) {
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
