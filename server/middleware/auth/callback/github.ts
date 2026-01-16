// import dependencies
import axios from 'axios';

// import local files
import config from '../../../utils/config.js';
import { fetchProvider } from '../../../database/queries/provider.js';
import { getAuthCallbackUrl } from '../../../../shared/utils/authenication.js';
import { handleError } from '../../../utils/errors.js';

const githubCallback = async (request, response, next) => {
  try {
    const { code } = request.query;

    if (!code) return response.status(400).send('No code provided');

    const provider = await fetchProvider('github');

    if (!provider) {
      return response.redirect('/auth/error');
    }

    const websiteUrl = config.get('websiteUrl');

    const params = getAuthCallbackUrl(
      'github',
      provider.clientId,
      provider.clientSecret,
      code,
      `${websiteUrl}/api/auth/callback/github`
    );

    const { data } = await axios.post(...params);

    const { access_token } = data;

    const userQuery = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const user = userQuery.data;

    if (!user || user.type !== 'User') {
      return response.redirect('/error?code=not_a_user&provider=github');
    }

    const emailInfo = await axios.get('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/json',
      },
    });

    const primaryEmail = emailInfo.data.find(
      (e) => e.primary && e.verified
    )?.email;

    if (!primaryEmail) {
      return response.redirect('/error?code=missing_email&provider=github');
    }

    const { id, login, avatar_url } = user;

    response.locals.authUser = {
      id,
      avatar: avatar_url,
      username: login,
      email: primaryEmail,
      provider: 'github',
    };

    next();
  } catch (error) {
    handleError(error, response);
  }
};

export default githubCallback;
