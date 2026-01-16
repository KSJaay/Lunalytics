// import dependencies
import axios from 'axios';

// import local files
import { getAuthCallbackUrl } from '../../../../shared/utils/authenication.js';
import { fetchProvider } from '../../../database/queries/provider.js';
import config from '../../../utils/config.js';
import { handleError } from '../../../utils/errors.js';

const googleCallback = async (request, response, next) => {
  try {
    const { code } = request.query;

    if (!code) return response.status(400).send('No code provided');

    const provider = await fetchProvider('google');

    if (!provider) {
      return response.redirect(
        '/auth/error?code=provider_not_found&provider=google'
      );
    }

    const websiteUrl = config.get('websiteUrl');

    const params = getAuthCallbackUrl(
      'google',
      provider.clientId,
      provider.clientSecret,
      code,
      `${websiteUrl}/api/auth/callback/google`
    );

    const { data } = await axios.post(...params);

    const { access_token } = data;

    const userInfo = await axios.get(
      'https://www.googleapis.com/oauth2/v2/userinfo?alt=json',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const { picture, id, email, verified_email } = userInfo.data;

    if (!verified_email) {
      return response.redirect('/error?code=unverified_user&provider=google');
    }

    response.locals.authUser = {
      id,
      email,
      avatar: picture,
      username: 'unknown',
      provider: 'google',
    };

    return next();
  } catch (error) {
    handleError(error, response);
  }
};

export default googleCallback;
