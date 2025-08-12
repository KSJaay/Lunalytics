import axios from 'axios';

axios.interceptors.response.use(function (response) {
  if (response.headers['content-type']?.includes('application/json')) {
    if (
      response.data?.setupRequired === true &&
      window.location.pathname !== '/setup'
    ) {
      window.location.href = '/setup';
    }
  }
  return response;
});

const createURL = (path, params) => {
  if (!path) return path;
  if (path?.startsWith('http')) return new URL(path).toString();

  if (import.meta.env.PROD) {
    if (!params) return path;

    const searchParams = new URLSearchParams(params).toString();

    return `${path}?${searchParams}`;
  }

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:2308';

  if (!params) return `${apiUrl}${path}`;

  const searchParams = new URLSearchParams(params).toString();
  return `${apiUrl}${path}?${searchParams}`;
};

const createGetRequest = async (path, params = {}, headers = {}) => {
  const urlParams = new URLSearchParams(window.location.search);
  const currentParams = Object.fromEntries(urlParams.entries());
  const mergedParams = { ...currentParams, ...params };

  return axios({
    method: 'GET',
    url: createURL(path),
    params: mergedParams,
    headers,
    withCredentials: true,
    timeout: 5000,
    signal: AbortSignal.timeout(5000),
  });
};

const createPostRequest = async (
  path,
  data = {},
  headers = {},
  params = {}
) => {
  const urlParams = new URLSearchParams(window.location.search);
  const currentParams = Object.fromEntries(urlParams.entries());
  const mergedParams = { ...currentParams, ...params };

  return axios({
    method: 'POST',
    url: createURL(path),
    params: mergedParams,
    data,
    headers,
    withCredentials: true,
    timeout: 5000,
    signal: AbortSignal.timeout(5000),
  });
};

export { createGetRequest, createPostRequest };
