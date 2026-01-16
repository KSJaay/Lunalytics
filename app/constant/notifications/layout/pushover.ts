import type { NotificationInputLayoutType } from '../../../../shared/types/constant/notifications';

export const PushoverLayout: NotificationInputLayoutType[] = [
  {
    type: 'group',
    items: [
      {
        type: 'input',
        key: 'friendlyName',
        title: 'Friendly Name',
        placeholder: 'Lunalytics',
      },
      {
        type: 'password',
        isDataField: true,
        key: 'userKey',
        title: 'User Key',
        placeholder: 'xxxxxxxxxxxxxxxx',
      },
      {
        type: 'password',
        key: 'token',
        title: 'Application Token',
        placeholder: 'xxxxxxxxxxxxxxxx',
      },
      {
        type: 'input',
        isDataField: true,
        key: 'device',
        title: 'Device',
      },
    ],
  },
  {
    type: 'dropdown',
    isDataField: true,
    key: 'priority',
    title: 'Priority',
    defaultValue: '0',
    options: [
      { id: '-2' },
      { id: '-1' },
      { id: '0' },
      { id: '1' },
      { id: '2' },
    ],
  },
  {
    type: 'number',
    isDataField: true,
    key: 'ttl',
    title: 'Message TTL (Seconds)',
  },
];
