// import dependencies
import axios from 'axios';

// import local files
import config from '../../../utils/config.js';
import { handleError } from '../../../utils/errors.js';
import { fetchProvider } from '../../../database/queries/provider.js';
import { getAuthCallbackUrl } from '../../../../shared/utils/authenication.js';

const slackCallback = async (request, response, next) => {
  try {
    const { code } = request.query;

    if (!code) return response.status(400).send('No code provided');

    const provider = await fetchProvider('slack');

    if (!provider) {
      return response.redirect('/auth/error');
    }

    const websiteUrl = config.get('websiteUrl');
    const params = getAuthCallbackUrl(
      'slack',
      provider.clientId,
      provider.clientSecret,
      code,
      `${websiteUrl}/api/auth/callback/slack`
    );

    const { data } = await axios.post(...params);

    const { access_token } = data;

    const userInfo = await axios.get(
      'https://slack.com/api/openid.connect.userInfo',
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const user = userInfo.data;

    if (!user || !user.email) {
      return response.redirect(
        '/auth/error?code=unverified_user&provider=slack'
      );
    }

    response.locals.authUser = {
      id: user.sub,
      email: user.email,
      avatar: user.picture,
      username: user.name,
      provider: 'slack',
    };

    return next();
  } catch (error) {
    handleError(error, response);
  }
};

export default slackCallback;
