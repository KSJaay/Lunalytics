export type NotificationType = 'basic' | 'pretty' | 'nerdy';

export interface ContextNotificationProps {
  id: string;
  platform: string;
  messageType: NotificationType;
  token: string;
  email: string;
  friendlyName: string;
  isEnabled: boolean;
  data?: Record<string, any>;
}
