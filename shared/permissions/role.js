import { PermissionsBits } from './bitFlags.js';

class Role {
  constructor(name, permissionFlags = 0) {
    this.name = name;
    this.permissionFlags = permissionFlags;
  }

  hasPermission(permission) {
    if (this.permissionFlags === PermissionsBits.ADMINISTRATOR) {
      return true;
    }

    return (this.permissionFlags & permission) === permission;
  }

  addPermission(permission) {
    this.permissionFlags |= permission;
  }

  removePermission(permission) {
    this.permissionFlags &= ~permission;
  }

  isValidPermission(permission) {
    return (
      this.permissionFlags === PermissionsBits.ADMINISTRATOR ||
      (this.permissionFlags & permission) === permission
    );
  }
}

export default Role;
