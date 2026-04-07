import { defineChain, mainnet, bsc, bscTestnet } from '@reown/appkit/networks';
import { createAppKit, type AppKitOptions } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import {
  AppKitNetwork,
  type CaipNetwork,
  type ChainNamespace
} from '@reown/appkit-common';
import type { Config, CreateConfigParameters } from '@wagmi/core';
import * as viemNetworks from 'viem/chains';
import { MVX_CHAIN_IDS } from '../../constants';
import { InMemoryStore } from '../../store/inMemoryStore';
import { SuiAdapter } from '../adapters/SuiAdapter';

const suiMainnet = defineChain({
  id: 'mainnet',
  name: 'SUI Mainnet',
  nativeCurrency: { name: 'SUI', symbol: 'SUI', decimals: 9 },
  rpcUrls: {
    default: { http: ['https://fullnode.mainnet.sui.io:443'] }
  },
  blockExplorers: {
    default: { name: 'SUI Explorer', url: 'https://explorer.sui.io/' }
  },
  chainNamespace: 'sui',
  caipNetworkId: 'sui:mainnet'
});

const suiTestnet = defineChain({
  id: 'testnet',
  name: 'SUI Testnet',
  nativeCurrency: { name: 'SUI', symbol: 'SUI', decimals: 9 },
  rpcUrls: {
    default: { http: ['https://fullnode.testnet.sui.io:443'] }
  },
  blockExplorers: {
    default: {
      name: 'SUI Explorer',
      url: 'https://explorer.sui.io/?network=testnet'
    }
  },
  chainNamespace: 'sui',
  caipNetworkId: 'sui:testnet'
});

const suiDevnet = defineChain({
  id: 'devnet',
  name: 'SUI Devnet',
  nativeCurrency: { name: 'SUI', symbol: 'SUI', decimals: 9 },
  rpcUrls: {
    default: { http: ['https://fullnode.devnet.sui.io:443'] }
  },
  blockExplorers: {
    default: {
      name: 'SUI Explorer',
      url: 'https://explorer.sui.io/?network=devnet'
    }
  },
  chainNamespace: 'sui',
  caipNetworkId: 'sui:devnet'
});

const suiNetworkDefinitions: Record<
  NonNullable<InitOptions['suiEnvironment']>,
  CaipNetwork
> = {
  mainnet: suiMainnet,
  testnet: suiTestnet,
  devnet: suiDevnet
};

export type InitOptions = {
  appKitOptions: Omit<AppKitOptions, 'networks'>;
  adapterConfig: Partial<CreateConfigParameters>;
  acceptedChainIDs: string[];
  acceptedConnectorsIDs?: string[];
  apiURL: string;
  bridgeURL: string;
  mvxApiURL: string;
  mvxExplorerAddress: string;
  mvxChainId: '31' | '44' | '54';
  suiEnvironment?: 'mainnet' | 'testnet' | 'devnet';
  suiFeaturedWalletIds?: string[];
};

export enum SuiMethods {
  SIGN_TRANSACTION = 'sui_signTransaction',
  SIGN_AND_EXECUTE_TRANSACTION = 'sui_signAndExecuteTransaction',
  SIGN_PERSONAL_MESSAGE = 'sui_signPersonalMessage'
}

export async function init(options: InitOptions): Promise<{
  config: Config;
  appKit: any;
  options: InitOptions;
  supportedChains: AppKitNetwork[];
}> {
  const store = InMemoryStore.getInstance();
  store.setItem('apiURL', options.apiURL);
  store.setItem('bridgeURL', options.bridgeURL);
  store.setItem('mvxApiURL', options.mvxApiURL);
  store.setItem('mvxExplorerAddress', options.mvxExplorerAddress);
  store.setItem('mvxChainId', options.mvxChainId);

  const networks = { ...viemNetworks };

  const acceptedNetworks = Object.values(networks)
    .filter(
      (chain) =>
        options.acceptedChainIDs.includes(chain.id.toString()) &&
        !MVX_CHAIN_IDS.includes(chain.id.toString())
    )
    .map((network) => network) as AppKitNetwork[];

  const supportedChains: AppKitNetwork[] = [
    mainnet,
    bsc,
    bscTestnet,
    ...acceptedNetworks
  ];

  const allNetworks: AppKitNetwork[] = [...supportedChains];

  if (options.suiEnvironment) {
    const suiNetwork = suiNetworkDefinitions[options.suiEnvironment];
    allNetworks.push(suiNetwork);
  }

  const wagmiAdapter = new WagmiAdapter({
    ...options.adapterConfig,
    ssr: options.adapterConfig.ssr ?? true,
    projectId: options.appKitOptions.projectId,
    networks: supportedChains
  });

  const adapters: any[] = [wagmiAdapter];

  if (options.suiEnvironment) {
    const suiNetwork = suiNetworkDefinitions[options.suiEnvironment];
    const explicitSuiCaip = suiNetwork.caipNetworkId ?? `sui:${suiNetwork.id}`;
    adapters.push(new SuiAdapter({ explicitCaipChains: [explicitSuiCaip] }));
  }

  // Do not call UniversalProvider.init() here — AppKit creates the shared provider
  // internally. A second init was racing MVx sdk-dapp WC + Reown session storage.
  const appKit = createAppKit({
    ...options.appKitOptions,
    adapters,
    networks: [allNetworks[0], ...allNetworks.slice(1)]
  });

  // Await AppKit init (WC session + non-EVM namespaces); wagmi reconnects separately.
  await appKit.ready();

  // If WalletConnect already has a persisted `sui` namespace but AppKit did not attach the
  // account (e.g. connector id missing in storage so sync took the wrong branch), re-run the
  // same WC→ChainController sync AppKit uses internally — mirrors reading session first, like
  // a direct UniversalProvider flow.
  if (options.suiEnvironment) {
    const wc = await appKit.getUniversalProvider();
    const suiNs = wc?.session?.namespaces?.['sui'];
    if (
      suiNs?.accounts?.length &&
      !appKit.getCaipAddress('sui' as ChainNamespace)
    ) {
      await (
        appKit as unknown as {
          syncWalletConnectAccount?: () => Promise<void>;
        }
      ).syncWalletConnectAccount?.();
    }
  }

  return {
    config: wagmiAdapter.wagmiConfig,
    appKit,
    options,
    supportedChains: allNetworks
  };
}
