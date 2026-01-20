const parseJson = (str: string) => {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
};

const stringifyJson = (obj: object | Array<any>) => {
  try {
    return JSON.stringify(obj);
  } catch {
    return null;
  }
};

export const cleanNotification = (notification: any) => ({
  id: notification.id,
  workspaceId: notification.workspaceId,
  platform: notification.platform,
  messageType: notification.messageType,
  token: notification.token,
  email: notification.email,
  friendlyName: notification.friendlyName,
  isEnabled: notification.isEnabled == '1',
  data:
    typeof notification.data === 'string'
      ? parseJson(notification.data)
      : notification.data,
});

export const stringifyNotification = (notification: any) => ({
  id: notification.id,
  workspaceId: notification.workspaceId,
  platform: notification.platform,
  messageType: notification.messageType,
  token: notification.token,
  email: notification.email,
  friendlyName: notification.friendlyName,
  isEnabled: notification.isEnabled == '1',
  data: stringifyJson(notification.data),
});
