import { getDemoUser, resetDemoUser } from '../database/queries/user.js';
import { setDemoCookie } from '../../shared/utils/cookies.js';
import config from '../utils/config.js';

const isDemoMode = config.get('isDemo');

const isDemo = async (request, response, next) => {
  const { session_token } = request.cookies;

  if (process.env.NODE_ENV === 'production' && isDemoMode && !session_token) {
    if (
      !request.url.startsWith('/register') &&
      !request.url.startsWith('/login')
    ) {
      const cookie = await getDemoUser();
      setDemoCookie(response, 'session_token', cookie);
      request.cookies['session_token'] = cookie;
    }
  }

  if (process.env.NODE_ENV === 'production' && isDemoMode) {
    await resetDemoUser();
  }

  return next();
};

export default isDemo;
