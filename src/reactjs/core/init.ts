import type { AppKitOptions } from '@reown/appkit';
import { bsc, mainnet } from '@reown/appkit/networks';
import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import type { CreateConfigParameters } from '@wagmi/core';

export type InitOptions = {
  /**
   * @reown AppKit options
   */
  appKitOptions: AppKitOptions;
  /**
   * WagmiAdapter config
   */
  adapterConfig: Partial<CreateConfigParameters>;
  /**
   * Accepted connectors IDs
   */
  acceptedConnectorsIDs?: string[];
};

export function init(options: InitOptions) {
  const wagmiAdapter = new WagmiAdapter({
    ...options.adapterConfig,
    ssr: options.adapterConfig.ssr ?? true,
    projectId: options.appKitOptions.projectId,
    networks: options.appKitOptions.networks
  });

  const networks = [mainnet, bsc, ...options.appKitOptions.networks];
  const uniqueNetworks = networks.filter(
    (network, index) =>
      networks.findIndex(
        (searchingNetwork) => network.id === searchingNetwork.id
      ) === index
  );

  const appKit = createAppKit({
    ...options.appKitOptions,
    adapters: [wagmiAdapter],
    networks: [uniqueNetworks[0], ...uniqueNetworks.slice(1)],
  });

  return {
    config: wagmiAdapter.wagmiConfig,
    appKit,
    options
  };
}