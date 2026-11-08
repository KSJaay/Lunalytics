const createURL = (
  path: string = '',
  params?: Record<string, string | number | boolean>
): string => {
  if (!path || !params) return path;

  if (path.includes('?')) {
    const [pathWithoutQuery, queries] = path.split('?');

    const queriesAsObject: Record<string, string> = {};
    queries.split('&').forEach((query) => {
      const [key, value] = query.split('=');
      queriesAsObject[key] = value;
    });

    const searchParams = new URLSearchParams({
      ...queriesAsObject,
      ...params,
    } as Record<string, string>).toString();

    return `${pathWithoutQuery}?${searchParams}`;
  }

  const searchParams = new URLSearchParams(
    params as Record<string, string>
  ).toString();

  return `${path}?${searchParams}`;
};

export { createURL };
