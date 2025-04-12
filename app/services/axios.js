import axios from 'axios';

axios.interceptors.response.use(
  function(response) {
    if (response.headers['content-type']?.includes('application/json')) {
        if (response.data?.setupRequired	=== true && window.location.pathname !== '/setup') {
          window.location.href = '/setup';
        }
    }
    return response;
  }
);

const createURL = (path, params) => {
  if (!path) return path;
  if (path?.startsWith('http')) return new URL(path);

  if (import.meta.env.PROD) {
    if (!params) return path;

    const searchParams = new URLSearchParams(params).toString();

    return `${path}?${searchParams}`;
  }

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:2308';

  if (!params) return new URL(`${apiUrl}${path}`);

  const searchParams = new URLSearchParams(params).toString();

  return new URL(`${apiUrl}${path}?${searchParams}`);
};

const createGetRequest = async (path, params, headers = {}) => {
  const url = createURL(path, params);

  return axios({
    method: 'GET',
    url,
    headers,
    withCredentials: true,
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
    headers,
    withCredentials: true,
    timeout: 5000,
    signal: AbortSignal.timeout(5000),
  });
};

export { createGetRequest, createPostRequest };
