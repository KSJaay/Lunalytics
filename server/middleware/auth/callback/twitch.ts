// import type definitions
import type { NextFunction, Request, Response } from 'express';

// import dependencies
import axios from 'axios';
import crypto from 'crypto';

// import local files
import config from '../../../utils/config.js';
import { fetchProvider } from '../../../database/queries/provider.js';
import { getAuthCallbackUrl } from '../../../../shared/utils/authenication.js';
import { handleError } from '../../../utils/errors.js';
import { deleteCookie } from '../../../../shared/utils/cookies.js';

const twitchCallback = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { code, state } = request.query;
    const storedState = request.cookies?.oauth_state;

    deleteCookie(response, 'oauth_state');

    if (
      !state ||
      !storedState ||
      !crypto.timingSafeEqual(
        Buffer.from(state as string),
        Buffer.from(storedState)
      )
    ) {
      return response.redirect('/error?code=invalid_state&provider=twitch');
    }

    if (!code) {
      return response.redirect('/error?code=missing_code&provider=twitch');
    }

    const provider = await fetchProvider('twitch');

    if (!provider) {
      return response.redirect(
        '/error?code=provider_not_found&provider=twitch'
      );
    }

    const websiteUrl = config.get('websiteUrl');
    const params = getAuthCallbackUrl(
      'twitch',
      provider.clientId,
      provider.clientSecret,
      code as string,
      `${websiteUrl}/api/auth/callback/twitch`
    );

    if (!params) {
      return response.redirect(
        '/error?code=invalid_provider_configuration&provider=twitch'
      );
    }

    const [url, postData, axiosConfig] = params;
    const { data } = await axios.post(url, postData, axiosConfig);

    const { access_token } = data;

    const query = await axios.get('https://api.twitch.tv/helix/users', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Client-ID': provider.clientId,
      },
    });

    const user = query.data.data[0];

    if (!user) {
      return response.redirect(
        '/auth/error?code=unverified_user&provider=twitch'
      );
    }

    const { email, display_name, id, profile_image_url } = user;

    response.locals.authUser = {
      id,
      email,
      avatar: profile_image_url,
      username: display_name,
      provider: 'twitch',
    };

    return next();
  } catch (error) {
    handleError(error, response);
  }
};

export default twitchCallback;
