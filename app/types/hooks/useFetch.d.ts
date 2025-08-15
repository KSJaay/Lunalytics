export interface UseFetchProps {
  url: string;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  onSuccess?: (data: any) => void;
  onFailure?: (error: any) => void;
}
