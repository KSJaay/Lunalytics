import { action, makeObservable, observable } from 'mobx';

import type { ContextVersionProps } from '../../shared/types/context/config';

class Config {
  version: ContextVersionProps;

  constructor() {
    this.version = {
      current: null,
      latest: null,
      updateAvailable: false,
      hasLoaded: false,
    };

    makeObservable(this, {
      version: observable,
      setVersion: action,
    });
  }

  setVersion = (version: ContextVersionProps) => {
    this.version = version;
  };
}

const config = new Config();
const useConfigContext = () => config;

export default useConfigContext;
