import { MemberPermissionBits } from './bitFlags.js';

export const oldPermsToFlags = {
  1: MemberPermissionBits.ADMINISTRATOR,
  2: MemberPermissionBits.ADMINISTRATOR,
  3:
    MemberPermissionBits.VIEW_MONITORS |
    MemberPermissionBits.MANAGE_MONITORS |
    MemberPermissionBits.VIEW_NOTIFICATIONS |
    MemberPermissionBits.MANAGE_NOTIFICATIONS |
    MemberPermissionBits.VIEW_INCIDENTS |
    MemberPermissionBits.MANAGE_INCIDENTS |
    MemberPermissionBits.VIEW_STATUS_PAGES |
    MemberPermissionBits.MANAGE_STATUS_PAGES,
  4:
    MemberPermissionBits.VIEW_MONITORS |
    MemberPermissionBits.VIEW_NOTIFICATIONS |
    MemberPermissionBits.VIEW_INCIDENTS |
    MemberPermissionBits.VIEW_STATUS_PAGES,
};
