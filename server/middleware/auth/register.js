// import local files
import { registerUser, fetchMembers } from '../../database/queries/user.js';
import { setServerSideCookie } from '../../../shared/utils/cookies.js';
import {
  handleError,
  UnprocessableError,
} from '../../../shared/utils/errors.js';
import validators from '../../../shared/validators/index.js';

const register = async (request, response) => {
  try {
    const { email, username, password } = request.body;

    const isInvalidAuth =
      validators.auth.email(email) ||
      validators.auth.username(username) ||
      validators.auth.password(password);

    if (isInvalidAuth) {
      throw new UnprocessableError(isInvalidAuth);
    }

    const members = await fetchMembers();

    if (members.length === 0) {
      const data = {
        email: email.toLowerCase(),
        displayName: username,
        password,
        avatar: null,
        permission: 1,
        isVerified: true,
      };

      const jwt = await registerUser(data);
      setServerSideCookie(response, 'access_token', jwt);

      return response.sendStatus(201);
    }

    const data = {
      email: email.toLowerCase(),
      displayName: username,
      password,
      avatar: null,
    };

    const jwt = await registerUser(data);

    setServerSideCookie(response, 'access_token', jwt);

    return response.sendStatus(200);
  } catch (error) {
    return handleError(error, response);
  }
};

export default register;
