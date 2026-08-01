export type NotificationMessageType = 'basic' | 'pretty' | 'nerdy';
export type NotificationPlatforms =
  | 'Discord'
  | 'Email'
  | 'HomeAssistant'
  | 'Pushover'
  | 'Slack'
  | 'Telegram'
  | 'Webhook';

interface NotificationErrors {
  id?: string;
  platform?: NotificationPlatforms;
  messageType?: NotificationMessageType;
  friendlyName?: string;
  token?: string;
  email?: string;
  isEnabled?: boolean;
}

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

export interface NotificationDiscordErrors extends NotificationErrors {
  username?: string;
  textMessage?: string;
}

export interface NotificationEmail {
  id: string;
  platform: NotificationPlatforms;
  messageType: NotificationMessageType;
  token: string;
  email: string;
  friendlyName: string;
  isEnabled: boolean;
  data: {
    port?: number;
    security?: boolean;
    username?: string;
    password?: string;
    fromEmail?: string;
    toEmail?: string;
    ccEmail?: string;
    bccEmail?: string;
  };
}

export interface NotificationEmailErrors extends NotificationErrors {
  port?: number;
  security?: boolean;
  username?: string;
  password?: string;
  fromEmail?: string;
  toEmail?: string;
  ccEmail?: string;
  bccEmail?: string;
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

export interface NotificationHomeAssistantErrors extends NotificationErrors {
  homeAssistantUrl?: string;
  homeAssistantNotificationService?: string;
}

export interface NotificationPushover {
  id: string;
  platform: NotificationPlatforms;
  messageType: NotificationMessageType;
  token: string;
  email: string;
  friendlyName: string;
  isEnabled: boolean;
  data: {
    device?: string;
    priority?: string | number;
    ttl?: string | number;
    userKey: string;
  };
}

export interface NotificationPushoverErrors extends NotificationErrors {
  general?: string;
  userKey?: string;
  device?: string;
  ttl?: string;
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
    channel?: string;
    textMessage?: string;
    username?: string;
  };
}

export interface NotificationSlackErrors extends NotificationErrors {
  channel?: string;
  textMessage?: string;
  username?: string;
}

export interface NotificationTelegram {
  id: string;
  platform: NotificationPlatforms;
  messageType: NotificationMessageType;
  token: string;
  email: string;
  friendlyName: string;
  isEnabled: boolean;
  data: {
    chatId?: string;
    disableNotification?: boolean;
    protectContent?: boolean;
  };
}

export interface NotificationTelegramErrors extends NotificationErrors {
  chatId?: string;
  disableNotification?: boolean;
  protectContent?: boolean;
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

export interface NotificationWebhookErrors extends NotificationErrors {
  requestType?: 'application/json' | 'form-data';
  additionalHeaders?: Record<string, any>;
}

export type NotificationProps =
  | NotificationDiscord
  | NotificationEmail
  | NotificationHomeAssistant
  | NotificationPushover
  | NotificationSlack
  | NotificationTelegram
  | NotificationWebhook;

export type NotificationErrorProps =
  | NotificationDiscordErrors
  | NotificationEmailErrors
  | NotificationHomeAssistantErrors
  | NotificationPushoverErrors
  | NotificationSlackErrors
  | NotificationTelegramErrors
  | NotificationWebhookErrors;
