import { action, computed, makeObservable, observable } from 'mobx';
import type { ContextMemberProps } from '../types/context/member';
import Role from '../../shared/permissions/role';

class MemberStore {
  member: ContextMemberProps | null;

  constructor() {
    this.member = null;

    makeObservable(this, {
      member: observable,
      setMember: action,
      isMemberLoaded: computed,
    });
  }

  setMember = (data: ContextMemberProps) => {
    this.member = { ...data, role: new Role('member', data.permission) };
  };

  get isMemberLoaded() {
    return this.member !== null;
  }
}

const member = new MemberStore();
const useMemberContext = () => member;

export default useMemberContext;
