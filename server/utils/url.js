const createURL = (path = '', params) => {
  const appUrl = process.env.MODE === 'production' ? '' : process.env.APP_URL;
  if (!params) return `${appUrl}${path}`;

  const searchParams = new URLSearchParams(params).toString();

  return `${appUrl}${path}?${searchParams}`;
};

module.exports = { createURL };
