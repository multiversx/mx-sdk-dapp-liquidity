import { AppKit } from '@reown/appkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ResolvedRegister } from '@wagmi/core';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { PropsWithChildren, useMemo } from 'react';
import { createContext } from 'react';
import { WagmiProvider } from 'wagmi';
import { InitOptions } from '../bootstrap/init';
import '../index.css';

export type Web3AppContextProps = {
  config: ResolvedRegister['config'];
  appKit: AppKit;
  options: InitOptions;
};

const queryClient = new QueryClient();

export const Web3AppContext = createContext<Web3AppContextProps | undefined>(
  undefined
);

let createdWeb3Modal = false;

export function Web3AppProvider({
  children,
  config,
  appKit,
  options
}: PropsWithChildren<Web3AppContextProps>) {
  if (!createdWeb3Modal) {
    createWeb3Modal({
      metadata: appKit.options.metadata,
      wagmiConfig: config,
      projectId: appKit.options.projectId,
      themeMode: appKit.options.themeMode,
      themeVariables: appKit.options.themeVariables
    });
    createdWeb3Modal = true;
  }

  const value = useMemo<Web3AppContextProps>(() => {
    return {
      config,
      appKit,
      options
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
