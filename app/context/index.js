import { createContext } from 'react';

// Global stores
import GlobalStore from './global';
import AlertBoxStore from './alert';

const store = {
  globalStore: new GlobalStore(),
  alertBoxStore: new AlertBoxStore(),
};

const ContextStore = createContext(store);

export default ContextStore;
