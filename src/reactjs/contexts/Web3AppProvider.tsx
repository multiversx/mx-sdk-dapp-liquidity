import { AppKit } from '@reown/appkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ResolvedRegister } from '@wagmi/core';
import { PropsWithChildren, useContext, useMemo } from 'react';
import { createContext } from 'react';
import { WagmiProvider } from 'wagmi';

export type Web3AppContextProps = {
  config: ResolvedRegister['config'];
  appKit: AppKit;
};

const queryClient = new QueryClient();

export const Web3AppContext = createContext<Web3AppContextProps | undefined>(
  undefined
);

export function Web3AppProvider({
  children,
  config,
  appKit
}: PropsWithChildren<Web3AppContextProps>) {
  const value = useMemo<Web3AppContextProps>(
    () => ({
      config,
      appKit
    }),
    [config, appKit]
  );
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

export function useWeb3App() {
  const context = useContext(Web3AppContext);

  if (context == null) {
    throw new Error('Web3AppContext must be used within a Web3AppProvider');
  }

  return context;
}
