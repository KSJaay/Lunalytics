import { action, makeObservable, observable } from 'mobx';

export default class ModalStore {
  constructor() {
    this.isOpen = false;
    this.content = null;
    this.glassmorph = true;
    makeObservable(this, {
      isOpen: observable,
      openModal: action,
      closeModal: action,
    });
  }

  openModal = (content, glassmorph = true) => {
    this.isOpen = true;
    this.content = content;
    this.glassmorph = glassmorph;
  };

  closeModal = () => {
    this.isOpen = false;
    this.content = null;
    this.glassmorph = true;
  };
}
