import { mainnet, bsc, bscTestnet } from '@reown/appkit/networks';
import { createAppKit, type AppKitOptions } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { AppKitNetwork, type CustomCaipNetwork } from '@reown/appkit-common';
import type { Config, CreateConfigParameters } from '@wagmi/core';
import { UniversalProvider } from '@walletconnect/universal-provider';
import * as viemNetworks from 'viem/chains';
import { MVX_CHAIN_IDS } from '../../constants';
import { InMemoryStore } from '../../store/inMemoryStore';

const SUI_DECIMALS = 9;

const suiNetworkDefinitions: Record<string, CustomCaipNetwork<'sui'>> = {
  mainnet: {
    id: 784,
    chainNamespace: 'sui' as const,
    caipNetworkId: 'sui:mainnet',
    name: 'Sui Mainnet',
    nativeCurrency: { name: 'SUI', symbol: 'SUI', decimals: SUI_DECIMALS },
    rpcUrls: {
      default: { http: ['https://fullnode.mainnet.sui.io:443'] }
    }
  } as CustomCaipNetwork<'sui'>,
  testnet: {
    id: 784,
    chainNamespace: 'sui' as const,
    caipNetworkId: 'sui:testnet',
    name: 'Sui Testnet',
    nativeCurrency: { name: 'SUI', symbol: 'SUI', decimals: SUI_DECIMALS },
    rpcUrls: {
      default: { http: ['https://fullnode.testnet.sui.io:443'] }
    }
  } as CustomCaipNetwork<'sui'>,
  devnet: {
    id: 784,
    chainNamespace: 'sui' as const,
    caipNetworkId: 'sui:devnet',
    name: 'Sui Devnet',
    nativeCurrency: { name: 'SUI', symbol: 'SUI', decimals: SUI_DECIMALS },
    rpcUrls: {
      default: { http: ['https://fullnode.devnet.sui.io:443'] }
    }
  } as CustomCaipNetwork<'sui'>
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

export async function init(options: InitOptions): Promise<{
  config: Config;
  appKit: any;
  options: InitOptions;
  supportedChains: AppKitNetwork[];
  suiConnector: SuiConnector | null;
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

  const supportedChains = [mainnet, bsc, bscTestnet, ...acceptedNetworks];

  // EVM AppKit — untouched, no manualWCControl, no universalProvider
  const wagmiAdapter = new WagmiAdapter({
    ...options.adapterConfig,
    ssr: options.adapterConfig.ssr ?? true,
    projectId: options.appKitOptions.projectId,
    networks: supportedChains
  });

  const appKit = createAppKit({
    ...options.appKitOptions,
    adapters: [wagmiAdapter],
    networks: [supportedChains[0], ...supportedChains.slice(1)]
  });

  // Sui connector — separate UniversalProvider + WalletConnect modal
  let suiConnector: SuiConnector | null = null;

  if (options.suiEnvironment) {
    const suiNetwork = suiNetworkDefinitions[options.suiEnvironment];
    const caipChain = suiNetwork.caipNetworkId;
    const suiFeaturedIds = options.suiFeaturedWalletIds ?? [
      '4119a5b3e5ebc809b6a3680a280ae517b92fead02e4c07b7cec0d3385c87aee2'
    ];

    const provider = await UniversalProvider.init({
      projectId: options.appKitOptions.projectId,
      metadata: options.appKitOptions.metadata,
      name: 'sui-connector'
    });

    // Restore existing session
    let restoredAddress: string | null = null;
    if (provider.session) {
      const accounts = provider.session.namespaces?.sui?.accounts ?? [];
      if (accounts.length > 0) {
        restoredAddress = accounts[0].split(':').pop() ?? null;
        console.log('[Sui] Restored session, address:', restoredAddress);
      }
    }

    const connect = async () => {
      const { WalletConnectModal } = await import('@walletconnect/modal');

      const modal = new WalletConnectModal({
        projectId: options.appKitOptions.projectId,
        themeMode: 'dark',
        explorerRecommendedWalletIds: suiFeaturedIds,
        explorerExcludedWalletIds: 'ALL'
      });

      provider.on('display_uri', (uri: string) => {
        modal.openModal({ uri });
      });

      const session = await provider.connect({
        optionalNamespaces: {
          sui: {
            methods: [
              'sui_signPersonalMessage',
              'sui_signTransaction',
              'sui_signAndExecuteTransaction'
            ],
            chains: [caipChain],
            events: []
          }
        }
      });

      modal.closeModal();

      if (!session) {
        throw new Error('No session established');
      }

      const accounts = session.namespaces?.sui?.accounts ?? [];
      if (accounts.length === 0) {
        throw new Error('No Sui accounts found in session');
      }

      const address = accounts[0].split(':').pop() ?? '';
      return { address, session };
    };

    const disconnect = async () => {
      await provider.disconnect();
    };

    const request = async (params: { method: string; params: any }) => {
      return await provider.request(params, caipChain);
    };

    const onSessionDelete = (callback: () => void) => {
      provider.on('session_delete', () => {
        console.log('[Sui] Session deleted by wallet');
        callback();
      });
    };

    suiConnector = {
      provider,
      suiEnvironment: options.suiEnvironment,
      connect,
      disconnect,
      request,
      onSessionDelete,
      restoredAddress
    };
  }

  return {
    config: wagmiAdapter.wagmiConfig,
    appKit,
    options,
    supportedChains,
    suiConnector
  };
}

export type SuiConnector = {
  provider: any;
  suiEnvironment: string;
  connect: () => Promise<{ address: string; session: any }>;
  disconnect: () => Promise<void>;
  request: (params: { method: string; params: any }) => Promise<any>;
  onSessionDelete: (callback: () => void) => void;
  restoredAddress?: string | null;
};
