import { action, makeObservable, observable } from 'mobx';

class ModalStore {
  isOpen: boolean;
  content: React.ReactNode | null;
  settings: React.ReactNode | null;
  isSettingsOpen: boolean;

  constructor() {
    this.isOpen = false;
    this.content = null;
    this.isSettingsOpen = false;
    makeObservable(this, {
      isOpen: observable,
      openModal: action,
      closeModal: action,
      isSettingsOpen: observable,
      openSettings: action,
      closeSettings: action,
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

  openSettings = (content: React.ReactNode) => {
    this.isSettingsOpen = true;
    this.settings = content;
  };

  closeSettings = () => {
    this.isSettingsOpen = false;
    this.settings = null;
  };
}

export default ModalStore;
