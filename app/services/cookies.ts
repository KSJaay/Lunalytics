const nintyDaysInMilliseconds = 2592000000 * 3;

const isProduction = import.meta.env.PROD || false;

export const setClientCookie = (key: string, value: string) => {
  let cookieString = `${encodeURIComponent(key)}=${encodeURIComponent(
    value
  )}; path=/;`;

  cookieString += ` expires=${new Date(
    Date.now() + nintyDaysInMilliseconds
  ).toUTCString()};`;

  cookieString += ` max-age=${nintyDaysInMilliseconds};`;
  cookieString += ` samesite=Strict;`;

  if (isProduction) {
    cookieString += ' secure;';
  }

  document.cookie = cookieString;
};
