import { PermissionsBits } from './bitFlags';

class User {
  constructor(user, roles = []) {
    this.user = user;
    this.roles = roles;
    this._permissions = this.calculateEffectivePermissions();
  }

  calculateEffectivePermissions() {
    return this.roles.reduce((acc, role) => acc | role.permissionFlags, 0);
  }

  get permissions() {
    return this._permissions;
  }

  setRoles(newRoles) {
    this.roles = newRoles;
    this._permissions = this.calculateEffectivePermissions();
  }

  addRole(role) {
    this.roles.push(role);
    this._permissions |= role.permissionFlags;
  }

  hasPermission(permission) {
    if (this._permissions === PermissionsBits.ADMINISTRATOR) {
      return true;
    }

    return (this._permissions & permission) === permission;
  }
}

export default User;
