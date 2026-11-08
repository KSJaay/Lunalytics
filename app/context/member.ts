// import type definitions
import type { ContextMemberProps } from '../../shared/types/context/member';

// import node modules
import { action, computed, makeObservable, observable } from 'mobx';

// import local files
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
