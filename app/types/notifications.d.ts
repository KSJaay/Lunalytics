export type NotificationMessageType = 'basic' | 'pretty' | 'nerdy';
export type NotificationPlatforms =
  | 'Discord'
  | 'HomeAssistant'
  | 'Slack'
  | 'Telegram'
  | 'Webhook';

export interface NotificationDiscord {
  id: string;
  platform: NotificationPlatforms;
  messageType: NotificationMessageType;
  friendlyName: string;
  token: string;
  email: string;
  isEnabled: boolean;
  data: {
    username?: string;
    textMessage?: string;
  };
}

export interface NotificationHomeAssistant {
  id: string;
  platform: NotificationPlatforms;
  messageType: NotificationMessageType;
  token: string;
  email: string;
  friendlyName: string;
  isEnabled: boolean;
  data: {
    homeAssistantUrl: string;
    homeAssistantNotificationService: string;
  };
}

export interface NotificationSlack {
  id: string;
  platform: NotificationPlatforms;
  messageType: NotificationMessageType;
  token: string;
  email: string;
  friendlyName: string;
  isEnabled: boolean;
  data: {
    channel: string;
    textMessage?: string;
    username?: string;
  };
}

export interface NotificationTelegram {
  chatId: string;
  disableNotification: boolean;
  friendlyName: string;
  messageType: NotificationMessageType;
  protectContent: boolean;
  token: string;

  id: string;
  platform: NotificationPlatforms;
  messageType: NotificationMessageType;
  token: string;
  email: string;
  friendlyName: string;
  isEnabled: boolean;
  data: {
    chatId: string;
    disableNotification: boolean;
    protectContent: boolean;
  };
}

export interface NotificationWebhook {
  id: string;
  platform: NotificationPlatforms;
  messageType: NotificationMessageType;
  friendlyName: string;
  token: string;
  email: string;
  isEnabled: boolean;
  data: {
    requestType: 'application/json' | 'form-data';
    additionalHeaders?: Record<string, any>;
  };
}

export type NotificationProps =
  | NotificationDiscord
  | NotificationHomeAssistant
  | NotificationSlack
  | NotificationTelegram
  | NotificationWebhook;
