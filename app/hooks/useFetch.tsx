import { useState, useEffect } from 'react';
import { createGetRequest } from '../services/axios';
import type { UseFetchProps, UseFetchResponse } from '../types/hooks';

function useFetch({
  url,
  params,
  headers,
  onSuccess,
  onFailure,
  hasFetched,
}: UseFetchProps) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    if (typeof hasFetched === 'boolean' && hasFetched) {
      return;
    }

    setIsLoading(true);
    setError(null);

    createGetRequest(url, params, headers)
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
        onSuccess?.(res.data);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
        onFailure?.(err);
      });
  }, [url, JSON.stringify(params), JSON.stringify(headers)]);

  return {
    data,
    error,
    isLoading,
    isError: error !== null,
  } as UseFetchResponse<any>;
}

export default useFetch;
