import { AppKit } from '@reown/appkit';
import { QueryClientProvider } from '@tanstack/react-query';
import type { ResolvedRegister } from '@wagmi/core';
import { PropsWithChildren, useMemo, useState } from 'react';
import { createContext } from 'react';
import { WagmiProvider } from 'wagmi';
import { getQueryClient } from './queryClient';
import { InitOptions } from '../bootstrap/init';
import '../index.css';

export type Web3AppContextProps = {
  config: ResolvedRegister['config'];
  appKit: AppKit;
  options: InitOptions;
  refetchTrigger: number;
  setRefetchTrigger: (trigger: number) => void;
};

const queryClient = getQueryClient();

export const Web3AppContext = createContext<Web3AppContextProps | undefined>(
  undefined
);

export function Web3AppProvider({
  children,
  config,
  appKit,
  options
}: PropsWithChildren<Web3AppContextProps>) {
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const value = useMemo<Web3AppContextProps>(() => {
    return {
      config,
      appKit,
      options,
      refetchTrigger,
      setRefetchTrigger
    };
  }, [config, appKit, options, refetchTrigger]);

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
