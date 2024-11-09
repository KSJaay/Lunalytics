// import local files
import { signInUser } from '../../database/queries/user.js';
import { setServerSideCookie } from '../../../shared/utils/cookies.js';
import { handleError } from '../../utils/errors.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';
import validators from '../../../shared/validators/index.js';

const login = async (request, response) => {
  try {
    const { email, password } = request.body;

    const isInvalidAuth =
      validators.auth.email(email) || validators.auth.password(password);

    if (isInvalidAuth) {
      throw new UnprocessableError(isInvalidAuth);
    }

    const { jwt, user } = await signInUser(email.toLowerCase(), password);

    setServerSideCookie(response, 'access_token', jwt);

    if (!user.isVerified) {
      return response.sendStatus(418);
    }

    return response.sendStatus(200);
  } catch (error) {
    return handleError(error, response);
  }
};

export default login;
