import { action, computed, makeObservable, observable } from 'mobx';
import type { ContextTokenProps } from '../../shared/types/context/tokens';

class ApiTokens {
  tokens: Map<string, ContextTokenProps>;

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

  setTokens = (data: ContextTokenProps[]) => {
    for (const token of data) {
      this.tokens.set(token.token, token);
    }
  };

  addToken = (token: ContextTokenProps) => {
    this.tokens.set(token.token, token);
  };

  updateTokenPermission = (
    tokenId: string,
    permission: number,
    name: string
  ) => {
    const token = this.tokens.get(tokenId);

    if (token) {
      token.permission = permission;
      token.name = name;
      this.tokens.set(tokenId, token);
    }
  };

  removeToken = (tokenId: string) => {
    this.tokens.delete(tokenId);
  };
}

const tokens = new ApiTokens();
const useTokensContext = () => tokens;

export default useTokensContext;
