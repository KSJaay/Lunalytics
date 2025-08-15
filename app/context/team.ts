import type { ContextTeamProps } from '../types/context/team';

import { action, computed, makeObservable, observable } from 'mobx';

class TeamStore {
  team: Map<string, ContextTeamProps>;

  constructor() {
    this.team = observable.map();

    makeObservable(this, {
      team: observable,
      setTeam: action,
      updateUserPermission: action,
      updateUserVerified: action,
      removeUser: action,
      teamMembers: computed,
    });
  }

  get teamMembers() {
    return Array.from(this.team.values());
  }

  setTeam = (data: ContextTeamProps[]) => {
    for (const user of data) {
      this.team.set(user.email, user);
    }
  };

  updateUserPermission = (email: string, permission: number) => {
    const user: ContextTeamProps | undefined = this.team.get(email);

    if (user) {
      user.permission = permission;
      this.team.set(email, user);
    }
  };

  updateUserVerified = (email: string) => {
    const user: ContextTeamProps | undefined = this.team.get(email);

    if (user) {
      user.isVerified = true;
      this.team.set(email, user);
    }
  };

  removeUser = (email: string) => {
    this.team.delete(email);
  };
}

const team = new TeamStore();
const useTeamContext = () => team;

export default useTeamContext;
