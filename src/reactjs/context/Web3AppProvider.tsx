// import {
//   bitcoin,
//   bitcoinTestnet,
//   solana,
//   solanaDevnet,
//   solanaTestnet
// } from '@reown/appkit/networks';
// import { bitcoinTestnet } from '@reown/appkit/networks';
import { AppKit } from '@reown/appkit/react';
// import { SolanaAdapter } from '@reown/appkit-adapter-solana';
// import {
//   ConnectionProvider,
//   WalletProvider
// } from '@solana/wallet-adapter-react';
// import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
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
};

// const solanaWeb3JsAdapter = new SolanaAdapter();
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
  const value = useMemo<Web3AppContextProps>(() => {
    return {
      config,
      appKit,
      options
    };
  }, [config, appKit, options]);

  // const wallets = [new PhantomWalletAdapter()];

  return (
    <Web3AppContext.Provider value={value}>
      <WagmiProvider config={config}>
        {/*<ConnectionProvider endpoint={solana.endpoint}>*/}
        {/*<WalletProvider wallets={wallets} autoConnect>*/}
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        {/*</WalletProvider>*/}
        {/*</ConnectionProvider>*/}
      </WagmiProvider>
    </Web3AppContext.Provider>
  );
}
