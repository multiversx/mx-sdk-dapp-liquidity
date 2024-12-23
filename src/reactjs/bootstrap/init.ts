import type { AppKitOptions } from '@reown/appkit';
import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { AppKitNetwork } from '@reown/appkit-common';
import type { CreateConfigParameters } from '@wagmi/core';
import * as networks from 'viem/chains';

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
   * Accepted chain IDs
   */
  acceptedChainIDs: number[];
  /**
   * Accepted connectors IDs
   */
  acceptedConnectorsIDs?: string[];
};

export function init(options: InitOptions) {
  const acceptedNetworks = Object.values(networks)
    .filter((chain) => options.acceptedChainIDs.includes(Number(chain.id)))
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
