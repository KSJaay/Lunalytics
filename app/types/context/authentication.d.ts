// List of providers type
export type Providers =
  | 'custom'
  | 'discord'
  | 'github'
  | 'google'
  | 'slack'
  | 'twitch';

export interface ContextAuthenticationConfigProps {
  nativeSignin: boolean;
  providers: Array<Providers>;
  register: boolean;
  sso: boolean;
}

export interface ContextAuthenticationProviderProps {
  clientId: string;
  clientSecret: string;
  data: any;
  email: string;
  enabled: boolean;
  id: number;
  provider: Providers;
}
