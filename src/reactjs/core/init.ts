import type { Metadata } from '@reown/appkit';
import { bsc, mainnet } from '@reown/appkit/networks';
import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import type { AppKitNetwork } from '@reown/appkit-common';
import type { CreateConfigParameters } from '@wagmi/core';

export type InitOptions = {
  /**
   * @reown project ID
   * */
  projectID: string;
  /**
   * Metadata object
   * */
  metadata: Metadata;
  /**
   * Supported networks
   */
  networks: AppKitNetwork[];
  /**
   * Enable debug mode
   * */
  debug?: boolean;
  /**
   * WagmiAdapter config
   *
   * */
  adapterConfig: Partial<CreateConfigParameters>;
};

export function init(options: InitOptions) {
  const wagmiAdapter = new WagmiAdapter({
    ...options.adapterConfig,
    projectId: options.projectID,
    networks: options.networks,
    ssr: options.adapterConfig.ssr ?? true
  });

  const networks = [mainnet, bsc, ...options.networks];
  const uniqueNetworks = networks.filter(
    (network, index) =>
      networks.findIndex(
        (searchingNetwork) => network.id === searchingNetwork.id
      ) === index
  );

  const appKit = createAppKit({
    adapters: [wagmiAdapter],
    networks: [uniqueNetworks[0], ...uniqueNetworks.slice(1)],
    projectId: options.projectID,
    metadata: options.metadata,
    debug: options.debug
  });

  return {
    config: wagmiAdapter.wagmiConfig,
    appKit
  };
}
