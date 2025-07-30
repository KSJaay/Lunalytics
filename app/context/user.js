import { action, makeObservable, observable } from 'mobx';
import Role from '../../shared/permissions/role';

export default class UserStore {
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

  setUser = (user) => {
    this.user = user;
    this.userRole = new Role('user', user.permission);
  };

  updateUser = (data) => {
    this.user = data;
    this.userRole = new Role('user', data.permission);
  };

  updateUsingKey = (key, value) => {
    this.user[key] = value;

    if (key === 'permission') {
      this.userRole = new Role('user', value);
    }
  };

  hasPermission = (permission) => {
    return this.userRole?.hasPermission(permission);
  };
}
