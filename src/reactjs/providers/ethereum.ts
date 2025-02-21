import { safeWindow } from '../constants';

export type EthereumProvider = { request(...args: any): Promise<any> } & {
  isMetaMask?: boolean;
  isXPortal?: boolean;
};

const isSupportedProvider = (provider: EthereumProvider) => {
  return provider?.isMetaMask || provider?.isXPortal;
};

export const ethereum = () => {
  const { ethereum: ethereumInstance } = safeWindow;

  let client = ethereumInstance as EthereumProvider;

  if (
    Array.isArray(ethereumInstance?.providers) &&
    ethereumInstance?.providers?.length > 0
  ) {
    ethereumInstance.providers.forEach(async (provider: EthereumProvider) => {
      if (isSupportedProvider(client)) {
        client = provider;
      }
    });
  }

  if (!isSupportedProvider(client)) {
    return null;
  }

  return client;
};
