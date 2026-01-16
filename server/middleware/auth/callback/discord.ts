// import dependencies
import axios from 'axios';

// import local files
import config from '../../../utils/config.js';
import { handleError } from '../../../utils/errors.js';
import { fetchProvider } from '../../../database/queries/provider.js';
import { getAuthCallbackUrl } from '../../../../shared/utils/authenication.js';

const discordCallback = async (request, response, next) => {
  try {
    const { code } = request.query;

    if (!code) {
      return response.redirect('/error?code=missing_code&provider=discord');
    }

    const provider = await fetchProvider('discord');

    if (!provider) {
      return response.redirect(
        '/error?code=provider_not_found&provider=discord'
      );
    }

    const websiteUrl = config.get('websiteUrl');

    const params = getAuthCallbackUrl(
      'discord',
      provider.clientId,
      provider.clientSecret,
      code,
      `${websiteUrl}/api/auth/callback/discord`
    );

    const { data } = await axios.post(...params);

    const { access_token } = data;

    const userQuery = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const user = userQuery.data;

    if (!user || !user.verified || !user.email) {
      return response.redirect('/error?code=unverified_user&provider=discord');
    }

    const { avatar, id, username, email } = user;

    response.locals.authUser = {
      id,
      email,
      avatar,
      username,
      provider: 'discord',
    };

    return next();
  } catch (error) {
    handleError(error, response);
  }
};

export default discordCallback;
