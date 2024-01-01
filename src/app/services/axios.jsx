import axios from 'axios';

function createURL(path, params) {
  if (path.startsWith('http')) return new URL(path);
  if (!params) return new URL(`${import.meta.env.VITE_API_URL}${path}`);

  const searchParams = new URLSearchParams(params).toString();

  return new URL(`${import.meta.env.VITE_API_URL}${path}?${searchParams}`);
}

const createGetRequest = async (path, params, headers = {}) => {
  const url = createURL(path, params);

  return axios({
    method: 'GET',
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
