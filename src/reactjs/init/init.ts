import {
  bitcoin,
  bitcoinTestnet,
  solana,
  solanaDevnet,
  solanaTestnet
} from '@reown/appkit/networks';
import { createAppKit, type AppKitOptions } from '@reown/appkit/react';
import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin';
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { AppKitNetwork } from '@reown/appkit-common';
import type { CreateConfigParameters } from '@wagmi/core';
import * as viemNetworks from 'viem/chains';
import { MVX_CHAIN_IDS } from '../../constants';
import { InMemoryStore } from '../../store/inMemoryStore';

export type InitOptions = {
  /**
   * @reown AppKit options
   */
  appKitOptions: Omit<AppKitOptions, 'networks'>;
  /**
   * WagmiAdapter config
   */
  adapterConfig: Partial<CreateConfigParameters>;
  /**
   * Accepted chain IDs. The chains with ids [31, 44, 54] will be ignored as these are mapped to the mvx networks as [1, D, T]
   */
  acceptedChainIDs: string[];
  /**
   * Accepted connectors IDs
   */
  acceptedConnectorsIDs?: string[];
  /**
   * Liquidity API URL
   */
  apiURL: string;
  /**
   * Bridge URL. This is used to redirect the user to the bridge status page for tracking transactions (history). Will be removed in the next major release.
   */
  bridgeURL: string;
  /**
   * MultiversX API URL
   */
  mvxApiURL: string;
  /**
   * MultiversX Explorer URL
   */
  mvxExplorerAddress: string;
  /**
   * MultiversX Chain ID
   * Possible options 31 | 44 | 54 which are mapped to 1 | D | T
   */
  mvxChainId: '31' | '44' | '54';
};

export function init(options: InitOptions) {
  const store = InMemoryStore.getInstance();
  store.setItem('apiURL', options.apiURL);
  store.setItem('bridgeURL', options.bridgeURL);
  store.setItem('mvxApiURL', options.mvxApiURL);
  store.setItem('mvxExplorerAddress', options.mvxExplorerAddress);
  store.setItem('mvxChainId', options.mvxChainId);

  const networks = {
    solana,
    solanaDevnet,
    solanaTestnet,
    bitcoin,
    bitcoinTestnet,
    ...viemNetworks
  };

  console.log('supported chains', {
    networks,
    viemNetworks
  });

  const acceptedNetworks = Object.values(networks)
    .filter(
      (chain) =>
        options.acceptedChainIDs.includes(chain.id.toString()) &&
        !MVX_CHAIN_IDS.includes(chain.id.toString())
    )
    .map((network) => network) as AppKitNetwork[];

  const supportedChains = [
    ...acceptedNetworks,
    bitcoin,
    bitcoinTestnet,
    solana,
    solanaDevnet,
    solanaTestnet
  ];

  const wagmiAdapter = new WagmiAdapter({
    ...options.adapterConfig,
    ssr: options.adapterConfig.ssr ?? true,
    projectId: options.appKitOptions.projectId,
    networks: supportedChains
  });
  const solanaAdapter = new SolanaAdapter();
  const bitcoinAdapter = new BitcoinAdapter({
    projectId: options.appKitOptions.projectId
  });

  const appKit = createAppKit({
    ...options.appKitOptions,
    adapters: [wagmiAdapter, solanaAdapter, bitcoinAdapter],
    networks: [supportedChains[0], ...supportedChains.slice(1)]
  });

  return {
    config: wagmiAdapter.wagmiConfig,
    appKit,
    options
  };
}
