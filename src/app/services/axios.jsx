import axios from 'axios';

async function Axios(method = 'GET', url, data = {}, headers = {}) {
  const query = await axios({
    method,
    url,
    data,
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
      ...headers,
    },
    timeout: 5000,
    signal: AbortSignal.timeout(5000),
  });

  if (query.status !== 200) {
    return query;
  }

  return query.status === 200 && (query.data || true);
}

export default Axios;
