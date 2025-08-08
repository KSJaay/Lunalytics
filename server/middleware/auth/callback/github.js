// import dependencies
import axios from 'axios';

// import local files
import config from '../../../utils/config.js';
import { fetchProvider } from '../../../database/queries/provider.js';
import { getAuthCallbackUrl } from '../../../../shared/utils/authenication.js';

const githubCallback = async (request, response) => {
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

    const userInfo = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const emailInfo = await axios.get('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/json',
      },
    });

    const primaryEmail = emailInfo.data.find(
      (e) => e.primary && e.verified
    )?.email;

    return response.send(userInfo.data);
  } catch (error) {
    console.log(error);
  }
};

export default githubCallback;
