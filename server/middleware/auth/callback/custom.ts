// import type definitions
import type { NextFunction, Request, Response } from 'express';

// import dependencies
import axios from 'axios';

// import local files
import config from '../../../utils/config.js';
import { fetchProvider } from '../../../database/queries/provider.js';
import { handleError } from '../../../utils/errors.js';
import { getAuthCallbackUrl } from '../../../../shared/utils/authenication.js';

const customCallback = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { code } = request.query;

    if (!code) {
      return response.redirect('/error?code=missing_code&provider=custom');
    }

    const provider = await fetchProvider('custom');

    if (!provider) {
      return response.redirect(
        '/auth/error?code=provider_not_found&provider=custom'
      );
    }

    const websiteUrl = config.get('websiteUrl');

    const params = getAuthCallbackUrl(
      'custom',
      provider.clientId,
      provider.clientSecret,
      code as string,
      `${websiteUrl}/api/auth/callback/custom`
    );

    if (!params) {
      return response.redirect(
        '/error?code=invalid_provider_configuration&provider=custom'
      );
    }

    const { data } = await axios.post(provider.data.tokenUrl, ...params);

    const { access_token } = data;

    const userInfoResponse = await axios.get(provider.data.userInfoUrl, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const user = userInfoResponse.data;

    if (!user || !user.email) {
      return response.redirect('/error?code=unverified_user&provider=custom');
    }

    response.locals.authUser = {
      id: user.id || user.sub,
      email: user.email,
      avatar: user.avatar || user.picture,
      username: user.username || user.name || 'unknown',
      provider: 'custom',
    };

    return next();
  } catch (error) {
    handleError(error, response);
  }
};

export default customCallback;
