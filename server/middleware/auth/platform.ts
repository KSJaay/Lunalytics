// import type definitions
import type { Request, Response } from 'express';

// import local files
import config from '../../utils/config.js';
import { handleError } from '../../utils/errors.js';
import { fetchProvider } from '../../database/queries/provider.js';
import { getAuthRedirectUrl } from '../../../shared/utils/authenication.js';

const redirectUsingProviderMiddleware = async (
  request: Request,
  response: Response
) => {
  try {
    const providerId =
      typeof request.params?.provider === 'string'
        ? request.params.provider.toLowerCase()
        : undefined;

    if (!providerId) return response.status(400).send('No provider provided');

    const provider = await fetchProvider(providerId);

    if (!provider) {
      return response.status(404).send('Unable to find SSO for provider');
    }

    const websiteUrl = config.get('websiteUrl');

    const redirectUrl = getAuthRedirectUrl(
      provider.provider,
      provider.clientId,
      `${websiteUrl}/api/auth/callback/${provider.provider}`,
      provider.data?.authUrl
    );

    if (!redirectUrl) {
      return response.status(500).send('Unable to generate redirect URL');
    }

    return response.redirect(redirectUrl);
  } catch (error) {
    return handleError(error, response);
  }
};

export default redirectUsingProviderMiddleware;
