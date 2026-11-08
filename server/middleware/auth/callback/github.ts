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

const githubCallback = async (
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
      return response.redirect('/error?code=invalid_state&provider=github');
    }

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
      code as string,
      `${websiteUrl}/api/auth/callback/github`
    );

    if (!params) {
      return response.redirect(
        '/error?code=invalid_provider_configuration&provider=github'
      );
    }

    const [url, postData, axiosConfig] = params;
    const { data } = await axios.post(url, postData, axiosConfig);

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
      (e: { primary: boolean; verified: boolean }) => e.primary && e.verified
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
