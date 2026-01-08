const parseJson = (str) => {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
};

const stringifyJson = (obj) => {
  try {
    return JSON.stringify(obj);
  } catch {
    return null;
  }
};

export const cleanNotification = (notification) => ({
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

export const stringifyNotification = (notification) => ({
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
