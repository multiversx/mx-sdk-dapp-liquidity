import { safeWindow } from '../constants/general';

const isSupportedProvider = (provider: any) => {
  return provider?.isMetaMask || provider?.isXPortal;
};

export const ethereum = () => {
  const { ethereum: ethereumInstance } = safeWindow;

  let client = ethereumInstance;

  if (
    Array.isArray(ethereumInstance?.providers) &&
    ethereumInstance?.providers?.length > 0
  ) {
    ethereumInstance.providers.forEach(async (provider: unknown) => {
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
