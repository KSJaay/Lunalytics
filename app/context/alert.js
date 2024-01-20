import { action, makeObservable, observable } from 'mobx';

export default class AlertBoxStore {
  constructor() {
    this.isOpen = false;
    this.content = null;
    makeObservable(this, {
      isOpen: observable,
      openAlertBox: action,
      closeAlertBox: action,
    });
  }

  openAlertBox = (content) => {
    this.isOpen = true;
    this.content = content;
  };

  closeAlertBox = () => {
    this.isOpen = false;
    this.content = null;
  };
}
