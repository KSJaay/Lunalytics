// import local files
const { registerUser, fetchMembers } = require('../../database/queries/user');
const { setServerSideCookie } = require('../../utils/cookies');
const { handleError, UnprocessableError } = require('../../utils/errors');
const validators = require('../../utils/validators');

const register = async (request, response) => {
  try {
    const { email, username, password } = request.body;

    const isInvalidAuth = validators.auth(username, password, email);

    if (isInvalidAuth) {
      throw new UnprocessableError(isInvalidAuth);
    }

    const members = await fetchMembers();

    if (members.length === 0) {
      const data = {
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        displayName: username,
        password,
        avatar: null,
        permission: 1,
        isVerified: true,
      };

      const jwt = await registerUser(data);
      setServerSideCookie(response, 'access_token', jwt);

      return response.sendStatus(200);
    }

    const data = {
      email: email.toLowerCase(),
      username: username.toLowerCase(),
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

module.exports = register;
