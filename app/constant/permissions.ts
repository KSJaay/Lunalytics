import { PermissionsBits } from '../../shared/permissions/bitFlags.js';
import type { ConstantPermissionsProp } from '../types/constant/permissions.js';

export const permissionsWithDescription: ConstantPermissionsProp[] = [
  {
    permission: PermissionsBits.VIEW_MONITORS,
    title: 'View Monitors',
    description:
      'Tokens with this permission will be able to view all monitors.',
  },
  {
    permission: PermissionsBits.MANAGE_MONITORS,
    title: 'Manage Monitors',
    description:
      'Tokens with this permission will be able to create, edit and delete monitors.',
  },
  {
    permission: PermissionsBits.VIEW_NOTIFICATIONS,
    title: 'View Notifications',
    description:
      'Tokens with this permission will be able to view all notifications.',
  },
  {
    permission: PermissionsBits.MANAGE_NOTIFICATIONS,
    title: 'Manage Notifications',
    description:
      'Tokens with this permission will be able to create, edit and delete notifications.',
  },
  {
    permission: PermissionsBits.VIEW_STATUS_PAGES,
    title: 'View Status Pages',
    description:
      'Tokens with this permission will be able to view all status pages.',
  },
  {
    permission: PermissionsBits.MANAGE_STATUS_PAGES,
    title: 'Manage Status Pages',
    description:
      'Tokens with this permission will be able to create, edit and delete status pages.',
  },
  {
    permission: PermissionsBits.VIEW_INCIDENTS,
    title: 'View Incidents',
    description:
      'Tokens with this permission will be able to view all incidents.',
  },
  {
    permission: PermissionsBits.MANAGE_INCIDENTS,
    title: 'Manage Incidents',
    description:
      'Tokens with this permission will be able to create, edit and delete incidents.',
  },
  {
    permission: PermissionsBits.MANAGE_TEAM,
    title: 'Manage Team',
    description:
      'Tokens with this permission will be able to manage the team members.',
  },
  {
    permission: PermissionsBits.ADMINISTRATOR,
    title: 'Administrator',
    description:
      'Tokens with this permission will have every permission and will be able to bypass any restrictions.',
  },
];
