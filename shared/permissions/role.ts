import { PermissionsBits } from './bitFlags.js';

class Role {
  name: string;
  permissionFlags: number;

  constructor(name: string, permissionFlags: number = 0) {
    this.name = name;
    this.permissionFlags = permissionFlags;
  }

  hasPermission(permission: number): boolean {
    if (this.permissionFlags === PermissionsBits.ADMINISTRATOR) {
      return true;
    }
    return (this.permissionFlags & permission) === permission;
  }

  addPermission(permission: number): void {
    this.permissionFlags |= permission;
  }

  removePermission(permission: number): void {
    this.permissionFlags &= ~permission;
  }
}

export default Role;
