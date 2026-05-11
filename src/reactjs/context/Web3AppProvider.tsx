import { IPlainTransactionObject } from '@multiversx/sdk-core/out';
import { AppKit } from '@reown/appkit/react';
import { AppKitNetwork } from '@reown/appkit-common';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ResolvedRegister } from '@wagmi/core';
import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { createContext } from 'react';
import { WagmiProvider } from 'wagmi';
import { InitOptions } from '../init/init';

export type Web3AppContextProps = {
  config: ResolvedRegister['config'];
  appKit: AppKit;
  options: InitOptions;
  supportedChains: AppKitNetwork[];
  nativeAuthToken: string;
  bridgeOnly?: boolean;
  signMvxTransactions?: (transactions: IPlainTransactionObject[]) => Promise<{
    error?: string;
    batchId?: string;
  }>;
  latestMvxTransactionHash?: string;
  resetMvxTransactionHash?: () => void;
};

export const Web3AppContext = createContext<Web3AppContextProps | undefined>(
  undefined
);

type Web3AppProviderType = Omit<Web3AppContextProps, 'supportedChains'> & {
  supportedChains?: AppKitNetwork[];
};

export function Web3AppProvider({
  children,
  config,
  appKit,
  options,
  supportedChains = [],
  nativeAuthToken,
  bridgeOnly = false,
  signMvxTransactions,
  latestMvxTransactionHash,
  resetMvxTransactionHash
}: PropsWithChildren<Web3AppProviderType>) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    queryClient.invalidateQueries();
  }, [nativeAuthToken]);

  const value = useMemo<Web3AppContextProps>(() => {
    return {
      config,
      appKit,
      options,
      supportedChains,
      nativeAuthToken,
      bridgeOnly,
      signMvxTransactions,
      latestMvxTransactionHash,
      resetMvxTransactionHash
    };
  }, [config, appKit, options, nativeAuthToken, signMvxTransactions]);

  return (
    <Web3AppContext.Provider value={value}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </Web3AppContext.Provider>
  );
}
