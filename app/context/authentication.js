import { action, computed, makeObservable, observable } from 'mobx';

class Authentication {
  constructor() {
    this.providers = observable.map();
    this.config = {};

    makeObservable(this, {
      providers: observable,
      config: observable,
      addProvider: action,
      setProviders: action,
      removeProvider: action,
      pauseProvider: action,
      allProviders: computed,
      setConfig: action,
      setConfigUsingKey: action,
    });
  }

  get allProviders() {
    return Array.from(this.providers.values());
  }

  getProvider = (providerId) => {
    return this.providers.get(providerId);
  };

  setProviders = (data) => {
    for (const provider of data) {
      this.providers.set(provider.provider, provider);
    }
  };

  addProvider = (provider) => {
    this.providers.set(provider.provider, provider);
  };

  removeProvider = (providerId) => {
    this.providers.delete(providerId);
  };

  pauseProvider = (providerId, paused) => {
    const provider = this.providers.get(providerId);
    if (provider) {
      provider.paused = paused;
      this.providers.set(providerId, provider);
    }
  };

  setConfig = (config) => {
    this.config = config;
  };

  setConfigUsingKey = (key, value) => {
    this.config[key] = value;
  };
}

const authentication = new Authentication();
const useAuthenticationContext = () => authentication;

export default useAuthenticationContext;
