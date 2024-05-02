const createURL = (path = '', params) => {
  if (!path || !params) return path;

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

    return `${pathWithoutQuery}?${searchParams}`;
  }

  const searchParams = new URLSearchParams(params).toString();

  return `${path}?${searchParams}`;
};

export { createURL };
