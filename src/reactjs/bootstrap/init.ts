import type { AppKitOptions } from '@reown/appkit';
import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { AppKitNetwork } from '@reown/appkit-common';
import type { CreateConfigParameters } from '@wagmi/core';
import * as networks from 'viem/chains';
import { InMemoryStore } from '../../store/inMemoryStore';
import { mvxChainIds } from '../constants/general';

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
  acceptedChainIDs: number[];
  /**
   * Accepted connectors IDs
   */
  acceptedConnectorsIDs?: string[];
  /**
   * Liquidity API URL
   */
  apiURL: string;
  /**
   * Bridge URL
   */
  bridgeURL: string;
};

export function init(options: InitOptions) {
  const store = InMemoryStore.getInstance();
  store.setItem('apiURL', options.apiURL);

  const acceptedNetworks = Object.values(networks)
    .filter(
      (chain) =>
        options.acceptedChainIDs.includes(Number(chain.id)) &&
        !mvxChainIds.includes(Number(chain.id))
    )
    .map((network) => network) as AppKitNetwork[];

  const wagmiAdapter = new WagmiAdapter({
    ...options.adapterConfig,
    ssr: options.adapterConfig.ssr ?? true,
    projectId: options.appKitOptions.projectId,
    networks: acceptedNetworks
  });

  const appKit = createAppKit({
    ...options.appKitOptions,
    adapters: [wagmiAdapter],
    networks: [acceptedNetworks[0], ...acceptedNetworks.slice(1)]
  });

  return {
    config: wagmiAdapter.wagmiConfig,
    appKit,
    options
  };
}
