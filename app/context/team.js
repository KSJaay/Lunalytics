import { createContext, useContext } from 'react';
import { action, makeObservable, observable } from 'mobx';

class TeamStore {
  constructor() {
    this.team = new Map();
    makeObservable(this, {
      team: observable,
      setTeam: action,
      updateUserPermission: action,
      updateUserVerified: action,
      removeUser: action,
    });
  }

  getTeam = () => {
    return Array.from(this.team.values());
  };

  setTeam = (data) => {
    for (const user of data) {
      this.team.set(user.email, user);
    }
  };

  updateUserPermission = (email, permission) => {
    this.team.get(email).permission = permission;
  };

  updateUserVerified = (email) => {
    const user = this.team.get(email);

    user.isVerified = true;
    this.team.set(email, user);
  };

  removeUser = (email) => {
    this.team.delete(email);
  };
}

const team = new TeamStore();
const store = createContext(team);
const useTeamContext = () => useContext(store);

export default useTeamContext;
