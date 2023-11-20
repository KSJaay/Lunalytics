import axios from 'axios';

async function Axios(method = 'GET', url, data = {}, headers = {}) {
  const query = await axios({
    method,
    url,
    data,
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      ...headers,
    },
  });

  if (query.status !== 200) {
    return query;
  }

  return query.status === 200 && (query.data || true);
}

export default Axios;
