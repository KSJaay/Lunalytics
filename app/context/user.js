import { action, makeObservable, observable } from 'mobx';

export default class UserStore {
  constructor() {
    this.user = {};
    makeObservable(this, {
      user: observable,
      setUser: action,
      updateUser: action,
    });
  }

  setUser = (user) => {
    this.user = user;
  };

  updateUser = (data) => {
    this.user = data;
  };
}
