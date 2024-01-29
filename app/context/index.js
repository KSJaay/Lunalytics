import { createContext, useContext } from 'react';

// Global stores
import GlobalStore from './global';
import ModalStore from './modal';

import UserStore from './user';

const store = {
  globalStore: new GlobalStore(),
  modalStore: new ModalStore(),
  userStore: new UserStore(),
};

const ContextStore = createContext(store);
const useContextStore = () => useContext(ContextStore);

export default useContextStore;
