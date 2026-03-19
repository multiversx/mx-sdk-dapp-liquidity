import { IPlainTransactionObject } from '@multiversx/sdk-core/out';
import { AppKit } from '@reown/appkit/react';
import { AppKitNetwork } from '@reown/appkit-common';
import { QueryClientProvider } from '@tanstack/react-query';
import type { ResolvedRegister } from '@wagmi/core';
import { PropsWithChildren, useMemo } from 'react';
import { createContext } from 'react';
import { WagmiProvider } from 'wagmi';
import { getQueryClient } from './queryClient';
import { InitOptions, SuiConnector } from '../init/init';

export type ExternalChainConnector = {
  chainType: string;
  chainName: string;
  chainIcon?: string;
  address: string | null;
  connector: SuiConnector;
  onConnect: (address: string) => void;
  onDisconnect: () => void;
};

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
  externalChains?: ExternalChainConnector[];
};

const queryClient = getQueryClient();

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
  resetMvxTransactionHash,
  externalChains
}: PropsWithChildren<Web3AppProviderType>) {
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
      resetMvxTransactionHash,
      externalChains
    };
  }, [config, appKit, options, nativeAuthToken, signMvxTransactions, externalChains]);

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
