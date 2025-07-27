import { action, computed, makeObservable, observable } from 'mobx';

class Invites {
  constructor() {
    this.invites = observable.map();

    makeObservable(this, {
      invites: observable,
      addInvite: action,
      setInvites: action,
      removeInvite: action,
      allInvites: computed,
    });
  }

  get allInvites() {
    return Array.from(this.invites.values());
  }

  setInvites = (data) => {
    for (const invite of data) {
      this.invites.set(invite.token, invite);
    }
  };

  addInvite = (invite) => {
    this.invites.set(invite.token, invite);
  };

  removeInvite = (inviteId) => {
    this.invites.delete(inviteId);
  };
}

const invites = new Invites();
const useInvitesContext = () => invites;

export default useInvitesContext;
