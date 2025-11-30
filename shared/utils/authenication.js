export const getAuthRedirectUrl = (
  provider,
  clientId,
  redirectUri,
  authUrl
) => {
  const queryParams = {
    client_id: clientId,
    redirect_uri: redirectUri,
  };

  if (provider === 'discord') {
    queryParams.response_type = 'code';
    queryParams.scope = 'identify email';

    return (
      'https://discord.com/oauth2/authorize?' +
      new URLSearchParams(queryParams).toString()
    );
  }

  if (provider === 'github') {
    queryParams.scope = 'read:user user:email';
    queryParams.allow_signup = true;

    return (
      'https://github.com/login/oauth/authorize?' +
      new URLSearchParams(queryParams).toString()
    );
  }

  if (provider === 'google') {
    queryParams.response_type = 'code';
    queryParams.scope = 'openid email';
    queryParams.prompt = 'consent';
    queryParams.access_type = 'offline';

    return (
      'https://accounts.google.com/o/oauth2/v2/auth?' +
      new URLSearchParams(queryParams).toString()
    );
  }

  // if (provider === 'instagram') {
  //   queryParams.response_type = 'code';
  //   queryParams.scope = 'user_profile';

  //   return (
  //     'https://api.instagram.com/oauth/authorize?' +
  //     new URLSearchParams(queryParams).toString()
  //   );
  // }

  if (provider === 'slack') {
    queryParams.scope = 'openid profile email';
    queryParams.response_type = 'code';

    return (
      'https://slack.com/openid/connect/authorize?' +
      new URLSearchParams(queryParams).toString()
    );
  }

  if (provider === 'twitch') {
    queryParams.response_type = 'code';
    queryParams.scope = 'user:read:email';

    return (
      'https://id.twitch.tv/oauth2/authorize?' +
      new URLSearchParams(queryParams).toString()
    );
  }

  if (provider === 'custom') {
    queryParams.response_type = 'code';
    queryParams.scope = 'openid profile email';

    return authUrl + '?' + new URLSearchParams(queryParams).toString();
  }

  return null;
};

export const getAuthCallbackUrl = (
  provider,
  client_id,
  client_secret,
  code,
  redirect_uri
) => {
  const queryParams = { client_id, client_secret, redirect_uri, code };

  if (provider === 'discord') {
    return [
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        ...queryParams,
        grant_type: 'authorization_code',
        scope: 'identify email',
      }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    ];
  }

  if (provider === 'github') {
    return [
      'https://github.com/login/oauth/access_token',
      new URLSearchParams(queryParams).toString(),
      { headers: { Accept: 'application/json' } },
    ];
  }

  if (provider === 'google') {
    queryParams.grant_type = 'authorization_code';

    return [
      'https://oauth2.googleapis.com/token',
      new URLSearchParams(queryParams).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    ];
  }

  // if (provider === 'instagram') {
  //   return [
  //     'https://api.instagram.com/oauth/access_token',
  //     new URLSearchParams({
  //       ...queryParams,
  //       grant_type: 'authorization_code',
  //     }).toString(),
  //     { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
  //   ];
  // }

  if (provider === 'slack') {
    return [
      'https://slack.com/api/openid.connect.token',
      new URLSearchParams({
        ...queryParams,
        grant_type: 'authorization_code',
      }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    ];
  }

  if (provider === 'twitch') {
    return [
      'https://id.twitch.tv/oauth2/token',
      new URLSearchParams({
        ...queryParams,
        grant_type: 'authorization_code',
      }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    ];
  }

  if (provider === 'custom') {
    return [
      new URLSearchParams({
        ...queryParams,
        grant_type: 'authorization_code',
      }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    ];
  }

  return null;
};
