// import type definitions
import type { ContextUserProps } from '../../shared/types/context/user';

// import node modules
import { action, makeObservable, observable } from 'mobx';

// import local files
import Role from '../../shared/permissions/role';
import { MemberPermissionBits } from '../../shared/permissions/bitFlags';

class UserStore {
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
      if (this.userRole.hasPermission(MemberPermissionBits.VIEW_MONITORS)) {
        return '/monitors';
      }

      if (this.userRole.hasPermission(MemberPermissionBits.VIEW_INCIDENTS)) {
        return '/incidents';
      }

      if (
        this.userRole.hasPermission(MemberPermissionBits.VIEW_NOTIFICATIONS)
      ) {
        return '/notifications';
      }

      if (this.userRole.hasPermission(MemberPermissionBits.VIEW_STATUS_PAGES)) {
        return '/status-pages';
      }
    }

    return false;
  };
}

const user = new UserStore();
const useUserContext = () => user;

export default useUserContext;
