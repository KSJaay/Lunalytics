import { action, makeObservable, observable } from 'mobx';
import Role from '../../shared/permissions/role';
import type { ContextUserProps } from '../../shared/types/context/user';
import { PermissionsBits } from '../../shared/permissions/bitFlags';

export default class UserStore {
  user: Record<string, any>;
  userRole: Role | null;

  constructor() {
    this.user = {};
    this.userRole = null;

    makeObservable(this, {
      user: observable,
      userRole: observable,
      setUser: action,
      updateUsingKey: action,
      updateUser: action,
    });
  }

  setUser = (user: ContextUserProps) => {
    this.user = user;
    this.userRole = new Role('user', user.permission);
  };

  updateUser = (data: ContextUserProps) => {
    this.user = data;
    this.userRole = new Role('user', data.permission);
  };

  updateUsingKey = (key: keyof ContextUserProps, value: any) => {
    this.user[key] = value;

    if (key === 'permission') {
      this.userRole = new Role('user', value);
    }
  };

  hasPermission = (permission: number) => {
    return this.userRole?.hasPermission(permission);
  };

  getUserRoleRoute = () => {
    if (this.userRole) {
      if (this.userRole.hasPermission(PermissionsBits.VIEW_MONITORS)) {
        return '/monitors';
      }

      if (this.userRole.hasPermission(PermissionsBits.VIEW_INCIDENTS)) {
        return '/incidents';
      }

      if (this.userRole.hasPermission(PermissionsBits.VIEW_NOTIFICATIONS)) {
        return '/notifications';
      }

      if (this.userRole.hasPermission(PermissionsBits.VIEW_STATUS_PAGES)) {
        return '/status-pages';
      }
    }

    return false;
  };
}
