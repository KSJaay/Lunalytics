import { describe, it, expect } from 'vitest';

import {
  PermissionsBits,
  UserPermissionBits,
  MemberPermissionBits,
} from '../../../shared/permissions/bitFlags.js';
import { oldPermsToFlags } from '../../../shared/permissions/oldPermsToFlags.js';

describe('shared/permissions/bitFlags', () => {
  it('PermissionsBits assigns sequential power-of-two values starting at 1', () => {
    expect(PermissionsBits.ADMINISTRATOR).toBe(1);
    expect(PermissionsBits.VIEW_MONITORS).toBe(2);
    expect(PermissionsBits.MANAGE_MONITORS).toBe(4);
    expect(PermissionsBits.CREATE_INVITE).toBe(1 << 10);
  });

  it('all flag values are unique within a set', () => {
    const values = Object.values(MemberPermissionBits);
    expect(new Set(values).size).toBe(values.length);
  });

  it('OR-ing two flags sets both bits', () => {
    const combined =
      MemberPermissionBits.VIEW_MONITORS | MemberPermissionBits.MANAGE_MONITORS;
    expect(combined & MemberPermissionBits.VIEW_MONITORS).toBe(
      MemberPermissionBits.VIEW_MONITORS
    );
    expect(combined & MemberPermissionBits.MANAGE_MONITORS).toBe(
      MemberPermissionBits.MANAGE_MONITORS
    );
  });

  it('AND-ing with an unset flag yields 0', () => {
    const onlyView = MemberPermissionBits.VIEW_MONITORS;
    expect(onlyView & MemberPermissionBits.MANAGE_TEAM).toBe(0);
  });

  it('UserPermissionBits ADMINISTRATOR equals 1', () => {
    expect(UserPermissionBits.ADMINISTRATOR).toBe(1);
  });
});

describe('shared/permissions/oldPermsToFlags', () => {
  it('maps role 1 → ADMINISTRATOR', () => {
    expect(oldPermsToFlags[1]).toBe(MemberPermissionBits.ADMINISTRATOR);
  });

  it('maps role 2 → ADMINISTRATOR (legacy alias)', () => {
    expect(oldPermsToFlags[2]).toBe(MemberPermissionBits.ADMINISTRATOR);
  });

  it('maps role 3 → editor combination of view + manage flags', () => {
    const expected =
      MemberPermissionBits.VIEW_MONITORS |
      MemberPermissionBits.MANAGE_MONITORS |
      MemberPermissionBits.VIEW_NOTIFICATIONS |
      MemberPermissionBits.MANAGE_NOTIFICATIONS |
      MemberPermissionBits.VIEW_INCIDENTS |
      MemberPermissionBits.MANAGE_INCIDENTS |
      MemberPermissionBits.VIEW_STATUS_PAGES |
      MemberPermissionBits.MANAGE_STATUS_PAGES;
    expect(oldPermsToFlags[3]).toBe(expected);
  });

  it('maps role 4 → viewer-only combination', () => {
    const expected =
      MemberPermissionBits.VIEW_MONITORS |
      MemberPermissionBits.VIEW_NOTIFICATIONS |
      MemberPermissionBits.VIEW_INCIDENTS |
      MemberPermissionBits.VIEW_STATUS_PAGES;
    expect(oldPermsToFlags[4]).toBe(expected);
  });
});
