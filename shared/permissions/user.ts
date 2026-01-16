import { PermissionsBits } from './bitFlags.js';
import Role from './role.js';

class User {
  user: any;
  roles: Role[];
  _permissions: number;

  constructor(user: any, roles: Role[] = []) {
    this.user = user;
    this.roles = roles;
    this._permissions = this.calculateEffectivePermissions();
  }

  calculateEffectivePermissions(): number {
    return this.roles.reduce(
      (acc: number, role: Role) => acc | role.permissionFlags,
      0
    );
  }

  get permissions(): number {
    return this._permissions;
  }

  setRoles(newRoles: Role[]): void {
    this.roles = newRoles;
    this._permissions = this.calculateEffectivePermissions();
  }

  addRole(role: Role): void {
    this.roles.push(role);
    this._permissions |= role.permissionFlags;
  }

  hasPermission(permission: number): boolean {
    if (this._permissions === PermissionsBits.ADMINISTRATOR) {
      return true;
    }
    return (this._permissions & permission) === permission;
  }
}

export default User;
