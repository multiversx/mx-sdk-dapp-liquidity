import type { AppKitOptions } from '@reown/appkit';
import {
  createAppKit,
  useAppKit,
  useAppKitAccount,
  useAppKitEvents,
  useAppKitNetwork,
  useAppKitState,
  useAppKitTheme,
  useDisconnect,
  useWalletInfo
} from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { AppKitNetwork } from '@reown/appkit-common';
import type { CreateConfigParameters } from '@wagmi/core';
import * as networks from 'viem/chains';
import {
  type Config,
  type CreateConnectorFn,
  useWaitForTransactionReceipt
} from 'wagmi';
import { InMemoryStore } from '../../store/inMemoryStore';
import { MVX_CHAIN_IDS } from '../constants/general';

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

function init(options: InitOptions) {
  const store = InMemoryStore.getInstance();
  store.setItem('apiURL', options.apiURL);

  const acceptedNetworks = Object.values(networks)
    .filter(
      (chain) =>
        options.acceptedChainIDs.includes(Number(chain.id)) &&
        !MVX_CHAIN_IDS.includes(Number(chain.id))
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

export {
  init,
  useAppKit,
  useAppKitAccount,
  useAppKitEvents,
  useAppKitNetwork,
  useAppKitState,
  useAppKitTheme,
  useDisconnect,
  useWalletInfo,
  useWaitForTransactionReceipt,
  Config,
  CreateConnectorFn
};
