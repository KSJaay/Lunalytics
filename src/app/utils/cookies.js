import cookie from 'cookie';

const parseUserCookie = (cookies) => {
  const parsedCookies = cookie.parse(cookies);
  const { user } = parsedCookies;

  if (!user) return {};
  return JSON.parse(user);
};

export { parseUserCookie };
