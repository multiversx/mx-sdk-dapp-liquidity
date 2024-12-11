import { Metadata } from '@reown/appkit';
import { bsc, mainnet } from '@reown/appkit/networks';
import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { AppKitNetwork } from '@reown/appkit-common';
import { CreateConfigParameters } from '@wagmi/core';
import { injected, walletConnect } from 'wagmi/connectors';
import { init, InitOptions } from '../init';

const projectID = 'testProjectID';

describe('init', () => {
  const mockMetadata: Metadata = {
    name: 'mx-sdk-dapp-liquidity',
    description: 'mx-sdk-dapp-liquidity example',
    url: 'https://example.com',
    icons: ['https://avatars.githubusercontent.com/u/179229932']
  };
  const mockNetwork: AppKitNetwork = {
    id: 123456789,
    caipNetworkId: 'eip155:123456789',
    chainNamespace: 'eip155',
    name: 'Custom Network',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH'
    },
    rpcUrls: {
      default: {
        http: ['RPC_URL'],
        webSocket: ['WS_RPC_URL']
      }
    },
    blockExplorers: {
      default: { name: 'Explorer', url: 'BLOCK_EXPLORER_URL' }
    }
  };
  const mockAdapterConfig: Partial<CreateConfigParameters> = {
    ssr: true,
    connectors: [
      injected(),
      walletConnect({
        projectId: projectID,
        metadata: mockMetadata,
        showQrModal: false
      })
    ]
  };

  beforeEach(() => {
    (WagmiAdapter as jest.Mock).mockClear();
    (createAppKit as jest.Mock).mockClear();
  });

  it('initializes with provided options', () => {
    const options: InitOptions = {
      adapterConfig: mockAdapterConfig,
      appKitOptions: {
        projectId: projectID,
        metadata: mockMetadata,
        networks: [mockNetwork],
        debug: true
      }
    };

    const result = init(options);

    expect(WagmiAdapter).toHaveBeenCalledWith({
      ...mockAdapterConfig,
      projectId: projectID,
      networks: [mockNetwork],
      ssr: true
    });
    expect(createAppKit).toHaveBeenCalledWith({
      adapters: [expect.any(WagmiAdapter)],
      networks: [mainnet, bsc, mockNetwork],
      projectId: projectID,
      metadata: mockMetadata,
      debug: true
    });
    expect(result).toHaveProperty('config');
    expect(result).toHaveProperty('appKit');
  });

  it('removes duplicate networks', () => {
    const options: InitOptions = {
      adapterConfig: mockAdapterConfig,
      appKitOptions: {
        projectId: projectID,
        metadata: mockMetadata,
        networks: [mainnet, mockNetwork, bsc, mockNetwork],
        debug: false
      }
    };

    init(options);

    expect(createAppKit).toHaveBeenCalledWith({
      adapters: [expect.any(WagmiAdapter)],
      networks: [mainnet, bsc, mockNetwork],
      projectId: projectID,
      metadata: mockMetadata,
      debug: false
    });
  });

  it('sets ssr to true if not provided in adapterConfig', () => {
    const options: InitOptions = {
      adapterConfig: {},
      appKitOptions: {
        projectId: projectID,
        metadata: mockMetadata,
        networks: [mockNetwork]
      }
    };

    init(options);

    expect(WagmiAdapter).toHaveBeenCalledWith({
      projectId: projectID,
      networks: [mockNetwork],
      ssr: true
    });
  });

  it('sets ssr to true if provided in adapterConfig', () => {
    const options: InitOptions = {
      adapterConfig: { ssr: true },
      appKitOptions: {
        projectId: projectID,
        metadata: mockMetadata,
        networks: [mockNetwork],
        debug: false
      }
    };

    init(options);

    expect(WagmiAdapter).toHaveBeenCalledWith({
      projectId: projectID,
      networks: [mockNetwork],
      ssr: true
    });
  });
});
