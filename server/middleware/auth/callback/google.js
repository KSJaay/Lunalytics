// import dependencies
import axios from 'axios';

// import local files
import { getAuthCallbackUrl } from '../../../../shared/utils/authenication.js';
import { fetchProvider } from '../../../database/queries/provider.js';
import config from '../../../utils/config.js';

const googleCallback = async (request, response) => {
  try {
    const { code } = request.query;

    if (!code) return response.status(400).send('No code provided');

    const provider = await fetchProvider('google');

    if (!provider) {
      return response.redirect('/auth/error');
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
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return response.send(userInfo.data);
  } catch (error) {
    console.log(error);
  }
};

export default googleCallback;
