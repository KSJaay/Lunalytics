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
