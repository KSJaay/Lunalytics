import { action, computed, makeObservable, observable } from 'mobx';
import type { ContextInviteProps } from '../types/context/invites';

class Invites {
  invites: Map<string, ContextInviteProps>;

  constructor() {
    this.invites = observable.map();

    makeObservable(this, {
      invites: observable,
      addInvite: action,
      setInvites: action,
      removeInvite: action,
      pauseInvite: action,
      allInvites: computed,
    });
  }

  get allInvites() {
    return Array.from(this.invites.values());
  }

  setInvites = (data: ContextInviteProps[]) => {
    for (const invite of data) {
      this.invites.set(invite.token, invite);
    }
  };

  addInvite = (invite: ContextInviteProps) => {
    this.invites.set(invite.token, invite);
  };

  removeInvite = (inviteId: string) => {
    this.invites.delete(inviteId);
  };

  pauseInvite = (inviteId: string, paused: boolean) => {
    const invite = this.invites.get(inviteId);
    if (invite) {
      invite.paused = paused;
      this.invites.set(inviteId, invite);
    }
  };
}

const invites = new Invites();
const useInvitesContext = () => invites;

export default useInvitesContext;
