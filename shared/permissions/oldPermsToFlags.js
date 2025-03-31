import { PermissionsBits } from './bitFlags.js';

export const oldPermsToFlags = {
  1: PermissionsBits.ADMINISTRATOR,
  2: PermissionsBits.ADMINISTRATOR,
  3:
    PermissionsBits.VIEW_MONITORS |
    PermissionsBits.MANAGE_MONITORS |
    PermissionsBits.VIEW_NOTIFICATIONS |
    PermissionsBits.MANAGE_NOTIFICATIONS,
  4: PermissionsBits.VIEW_MONITORS | PermissionsBits.VIEW_WEBHOOKS,
};
