import { getProviderById } from '../constants/provider.js';

export interface ProviderValidatorInput {
  clientId: string;
  clientSecret: string;
  provider: string;
  data?: { name?: string; [key: string]: any };
}

const ProviderValidator = ({
  clientId,
  clientSecret,
  provider,
  data = {},
}: ProviderValidatorInput): string | false => {
  if (!clientId) {
    return 'Client ID is required';
  }

  if (!clientSecret) {
    return 'Client Secret is required';
  }

  if (!provider || !getProviderById(provider)) {
    return 'Please provide a valid provider ID';
  }

  if (provider === 'custom') {
    if (!data?.name) {
      return 'Please provide a name for the custom provider';
    }
  }

  return false;
};

export default ProviderValidator;
