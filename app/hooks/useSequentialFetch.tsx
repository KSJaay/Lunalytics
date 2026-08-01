// import type definitions
import type {
  UseSequentialFetchProps,
  UseSequentialFetchResponse,
} from '../../shared/types/hooks';

// import dependencies
import { useEffect, useRef, useState } from 'react';

// import local files
import { createGetRequest } from '../services/axios';

function useSequentialFetch({
  requests,
  onFailure,
  onComplete,
  hasFetched,
}: UseSequentialFetchProps): UseSequentialFetchResponse {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any | null>(null);
  const [failedIndex, setFailedIndex] = useState<number | null>(null);

  const requestsRef = useRef(requests);
  const onFailureRef = useRef(onFailure);
  const onCompleteRef = useRef(onComplete);

  requestsRef.current = requests;
  onFailureRef.current = onFailure;
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (typeof hasFetched === 'boolean' && hasFetched) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const run = async () => {
      const list = requestsRef.current;

      for (let index = 0; index < list.length; index++) {
        const request = list[index];

        try {
          const response = await createGetRequest(
            request.url,
            request.params,
            request.headers
          );

          if (cancelled) return;

          request.onSuccess?.(response.data);
        } catch (err) {
          if (cancelled) return;

          setError(err);
          setFailedIndex(index);
          setIsLoading(false);

          const handled = request.onFailure?.(err) === true;

          if (!handled) {
            onFailureRef.current?.(err, index);
          }

          return;
        }
      }

      if (cancelled) return;

      setIsLoading(false);
      onCompleteRef.current?.();
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [hasFetched]);

  return {
    isLoading,
    error,
    isError: error !== null,
    failedIndex,
  };
}

export default useSequentialFetch;
