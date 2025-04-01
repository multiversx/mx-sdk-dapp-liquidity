import { AppKit } from '@reown/appkit/react';
import { AppKitNetwork } from '@reown/appkit-common';
import { QueryClientProvider } from '@tanstack/react-query';
import type { ResolvedRegister } from '@wagmi/core';
import { PropsWithChildren, useMemo } from 'react';
import { createContext } from 'react';
import { WagmiProvider } from 'wagmi';
import { getQueryClient } from './queryClient';
import { InitOptions } from '../init/init';

export type Web3AppContextProps = {
  config: ResolvedRegister['config'];
  appKit: AppKit;
  options: InitOptions;
  supportedChains: AppKitNetwork[];
};

const queryClient = getQueryClient();

export const Web3AppContext = createContext<Web3AppContextProps | undefined>(
  undefined
);

export function Web3AppProvider({
  children,
  config,
  appKit,
  options,
  supportedChains
}: PropsWithChildren<Web3AppContextProps>) {
  const value = useMemo<Web3AppContextProps>(() => {
    return {
      config,
      appKit,
      options,
      supportedChains
    };
  }, [config, appKit, options]);

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
