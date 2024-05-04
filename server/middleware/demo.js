import { getDemoUser } from '../database/queries/user.js';
import { setServerSideCookie } from '../utils/cookies.js';

const isDemo = async (request, response, next) => {
  const { demo } = request.query;

  if (process.env.IS_DEMO === true && demo === 'true') {
    const cookie = await getDemoUser();

    setServerSideCookie(response, 'access_token', cookie);
    request.cookies['access_token'] = cookie;
  }

  return next();
};

export default isDemo;
