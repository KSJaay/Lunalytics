import { createContext } from 'react';

// Global stores
import GlobalStore from './global';

const store = {
  globalStore: new GlobalStore(),
};

const ContextStore = createContext(store);

export default ContextStore;
