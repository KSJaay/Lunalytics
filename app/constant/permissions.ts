import { MemberPermissionBits } from '../../shared/permissions/bitFlags.js';
import type { ConstantPermissionsProp } from '../../shared/types/constant';

export const permissionsWithDescription: ConstantPermissionsProp[] = [
  {
    permission: MemberPermissionBits.VIEW_MONITORS,
    title: 'View Monitors',
    description:
      'Tokens with this permission will be able to view all monitors.',
  },
  {
    permission: MemberPermissionBits.MANAGE_MONITORS,
    title: 'Manage Monitors',
    description:
      'Tokens with this permission will be able to create, edit and delete monitors.',
  },
  {
    permission: MemberPermissionBits.VIEW_NOTIFICATIONS,
    title: 'View Notifications',
    description:
      'Tokens with this permission will be able to view all notifications.',
  },
  {
    permission: MemberPermissionBits.MANAGE_NOTIFICATIONS,
    title: 'Manage Notifications',
    description:
      'Tokens with this permission will be able to create, edit and delete notifications.',
  },
  {
    permission: MemberPermissionBits.VIEW_STATUS_PAGES,
    title: 'View Status Pages',
    description:
      'Tokens with this permission will be able to view all status pages.',
  },
  {
    permission: MemberPermissionBits.MANAGE_STATUS_PAGES,
    title: 'Manage Status Pages',
    description:
      'Tokens with this permission will be able to create, edit and delete status pages.',
  },
  {
    permission: MemberPermissionBits.VIEW_INCIDENTS,
    title: 'View Incidents',
    description:
      'Tokens with this permission will be able to view all incidents.',
  },
  {
    permission: MemberPermissionBits.MANAGE_INCIDENTS,
    title: 'Manage Incidents',
    description:
      'Tokens with this permission will be able to create, edit and delete incidents.',
  },
  {
    permission: MemberPermissionBits.MANAGE_TEAM,
    title: 'Manage Team',
    description:
      'Tokens with this permission will be able to manage the team members.',
  },
  {
    permission: MemberPermissionBits.ADMINISTRATOR,
    title: 'Administrator',
    description:
      'Tokens with this permission will have every permission and will be able to bypass any restrictions.',
  },
];
