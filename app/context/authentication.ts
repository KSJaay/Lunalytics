import { action, computed, makeObservable, observable } from 'mobx';
import type {
  ContextAuthenticationConfigProps,
  ContextAuthenticationProviderProps,
} from '../../shared/types/context/authentication';

class Authentication {
  providers: Map<string, ContextAuthenticationProviderProps>;
  config: ContextAuthenticationConfigProps;

  constructor() {
    this.providers = observable.map();
    this.config = {
      nativeSignin: false,
      providers: [],
      register: false,
      sso: false,
    };

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

  getProvider = (providerId: string) => {
    return this.providers.get(providerId);
  };

  setProviders = (data: ContextAuthenticationProviderProps[]) => {
    for (const provider of data) {
      this.providers.set(provider.provider, provider);
    }
  };

  addProvider = (provider: ContextAuthenticationProviderProps) => {
    this.providers.set(provider.provider, provider);
  };

  removeProvider = (providerId: string) => {
    this.providers.delete(providerId);
  };

  pauseProvider = (providerId: string, paused: boolean) => {
    const provider = this.providers.get(providerId);
    if (provider) {
      provider.enabled = paused;
      this.providers.set(providerId, provider);
    }
  };

  setConfig = (config: ContextAuthenticationConfigProps) => {
    this.config = config;
  };

  setConfigUsingKey = (
    key: keyof ContextAuthenticationConfigProps,
    value: any
  ) => {
    this.config[key] = value;
  };
}

const authentication = new Authentication();
const useAuthenticationContext = () => authentication;

export default useAuthenticationContext;
