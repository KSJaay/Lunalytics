export interface UseFetchProps {
  url: string;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  onSuccess?: (data: any) => void;
  onFailure?: (error: any) => void;
  hasFetched?: boolean;
}

export interface UseFetchResponse<T> {
  data: T | null;
  error: any | null;
  isLoading: boolean;
  isError: boolean;
}

export interface SequentialFetchRequest {
  url: string;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  onSuccess?: (data: any) => void;
  onFailure?: (error: any) => boolean | void;
}

export interface UseSequentialFetchProps {
  requests: SequentialFetchRequest[];
  onFailure?: (error: any, index: number) => void;
  onComplete?: () => void;
  hasFetched?: boolean;
}

export interface UseSequentialFetchResponse {
  isLoading: boolean;
  error: any | null;
  isError: boolean;
  failedIndex: number | null;
}
