export interface ContextVersionProps {
  current: string | null;
  latest: string | null;
  updateAvailable: boolean;
  hasLoaded: boolean;
}
