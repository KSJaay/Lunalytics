import { action, makeObservable, observable } from 'mobx';

class ModalStore {
  isOpen: boolean;
  content: React.ReactNode | null;

  constructor() {
    this.isOpen = false;
    this.content = null;
    makeObservable(this, {
      isOpen: observable,
      openModal: action,
      closeModal: action,
    });
  }

  openModal = (content: React.ReactNode) => {
    this.isOpen = true;
    this.content = content;
  };

  closeModal = () => {
    this.isOpen = false;
    this.content = null;
  };
}

export default ModalStore;
