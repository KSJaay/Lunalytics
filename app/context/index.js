import { createContext } from 'react';

// Global stores
import GlobalStore from './global';
import ModalStore from './modal';

const store = {
  globalStore: new GlobalStore(),
  modalStore: new ModalStore(),
};

const ContextStore = createContext(store);

export default ContextStore;
