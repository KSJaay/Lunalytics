import axios from 'axios';

const createURL = (path, params) => {
  if (!path) return path;
  if (path?.startsWith('http')) return new URL(path);

  const apiUrl = import.meta.env.PROD
    ? ''
    : import.meta.env.VITE_API_URL || 'http://localhost:2308';

  if (!params) return new URL(`${apiUrl}${path}`);

  const searchParams = new URLSearchParams(params).toString();

  return new URL(`${apiUrl}${path}?${searchParams}`);
};

const createGetRequest = async (path, params, headers = {}) => {
  const url = createURL(path, params);

  return axios({
    method: 'GET',
    url,
    withCredentials: true,
    headers: {
      ...headers,
    },
    timeout: 5000,
    signal: AbortSignal.timeout(5000),
  });
};

const createPostRequest = async (path, data = {}, headers = {}) => {
  const url = createURL(path);

  return axios({
    method: 'POST',
    url,
    data,
    withCredentials: true,
    headers: {
      ...headers,
    },
    timeout: 5000,
    signal: AbortSignal.timeout(5000),
  });
};

export { createGetRequest, createPostRequest };
