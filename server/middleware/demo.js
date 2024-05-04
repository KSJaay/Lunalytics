import { getDemoUser } from '../database/queries/user.js';
import { setServerSideCookie } from '../utils/cookies.js';

const isDemo = async (request, response, next) => {
  if (process.env.IS_DEMO) {
    const cookie = await getDemoUser();

    setServerSideCookie(response, 'access_token', cookie);
    request.cookies['access_token'] = cookie;
  }

  return next();
};

export default isDemo;
