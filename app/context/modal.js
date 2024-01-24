import { action, makeObservable, observable } from 'mobx';

export default class ModalStore {
  constructor() {
    this.isOpen = false;
    this.content = null;
    makeObservable(this, {
      isOpen: observable,
      openModal: action,
      closeModal: action,
    });
  }

  openModal = (content) => {
    this.isOpen = true;
    this.content = content;
  };

  closeModal = () => {
    this.isOpen = false;
    this.content = null;
  };
}
