const createURL = (path = '', params) => {
  const appUrl = process.env.MODE === 'production' ? '' : process.env.APP_URL;

  if (!path || !params) return `${appUrl}${path}`;

  if (path.includes('?')) {
    const [pathWithoutQuery, queries] = path.split('?');
    const queriesAsObject = {};

    queries.split('&').forEach((query) => {
      const [key, value] = query.split('=');
      queriesAsObject[key] = value;
    });

    const searchParams = new URLSearchParams({
      ...queriesAsObject,
      ...params,
    }).toString();

    return `${appUrl}${pathWithoutQuery}?${searchParams}`;
  }

  const searchParams = new URLSearchParams(params).toString();

  return `${appUrl}${path}?${searchParams}`;
};

module.exports = { createURL };
