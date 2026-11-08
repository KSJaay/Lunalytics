// import type definitions
import type { NextFunction, Request, Response } from 'express';

// import dependencies
import axios from 'axios';
import crypto from 'crypto';

// import local files
import config from '../../../utils/config.js';
import { handleError } from '../../../utils/errors.js';
import { fetchProvider } from '../../../database/queries/provider.js';
import { getAuthCallbackUrl } from '../../../../shared/utils/authenication.js';
import { deleteCookie } from '../../../../shared/utils/cookies.js';

const discordCallback = async (
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
      return response.redirect('/error?code=invalid_state&provider=discord');
    }

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
      code as string,
      `${websiteUrl}/api/auth/callback/discord`
    );

    if (!params) {
      return response.redirect(
        '/error?code=invalid_provider_configuration&provider=discord'
      );
    }

    const [url, postData, axiosConfig] = params;
    const { data } = await axios.post(url, postData, axiosConfig);

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
