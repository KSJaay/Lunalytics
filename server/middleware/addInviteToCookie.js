import { setServerSideCookie } from '../../shared/utils/cookies.js';

const addInviteToCookie = (request, response, next) => {
  const { invite } = request.query;

  if (invite) {
    setServerSideCookie(
      response,
      'invite',
      invite,
      request.protocol === 'https',
      'lax'
    );
  }

  next();
};

export default addInviteToCookie;
