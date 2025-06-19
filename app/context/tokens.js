import { createContext, useContext } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';

class ApiTokens {
  constructor() {
    this.tokens = observable.map();

    makeObservable(this, {
      tokens: observable,
      addToken: action,
      setTokens: action,
      updateTokenPermission: action,
      removeToken: action,
      allTokens: computed,
    });
  }

  get allTokens() {
    return Array.from(this.tokens.values());
  }

  setTokens = (data) => {
    for (const token of data) {
      this.tokens.set(token.token, token);
    }
  };

  addToken = (token) => {
    this.tokens.set(token.token, token);
  };

  updateTokenPermission = (tokenId, permission, name) => {
    const token = this.tokens.get(tokenId);

    token.permission = permission;
    token.name = name;
    this.tokens.set(tokenId, token);
  };

  removeToken = (tokenId) => {
    this.tokens.delete(tokenId);
  };
}

const tokens = new ApiTokens();
const store = createContext(tokens);
const useTokensContext = () => useContext(store);

export default useTokensContext;
