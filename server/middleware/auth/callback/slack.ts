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

const slackCallback = async (
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
      return response.redirect('/error?code=invalid_state&provider=slack');
    }

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
      code as string,
      `${websiteUrl}/api/auth/callback/slack`
    );

    if (!params) {
      return response.redirect(
        '/error?code=invalid_provider_configuration&provider=slack'
      );
    }

    const [url, postData, axiosConfig] = params;
    const { data } = await axios.post(url, postData, axiosConfig);

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
