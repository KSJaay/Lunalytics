export interface UserSettings {
  monitorsList?: Array<{
    type: 'monitor' | 'folder';
    isHidden: boolean;
    monitorId: string;
  }>;
}

export interface ContextUserProps {
  email: string;
  displayName: string;
  avatar: string;
  isVerified: boolean;
  permission: number;
  created_at: string;
  isOwner: boolean;
  settings: UserSettings;
}
