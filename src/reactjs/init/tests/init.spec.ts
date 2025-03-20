import { mainnet } from '@reown/appkit/networks';
import { Metadata, createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { AppKitNetwork } from '@reown/appkit-common';
import { CreateConfigParameters } from '@wagmi/core';
import { injected, walletConnect } from 'wagmi/connectors';
import { init, InitOptions } from '../init';

const projectID = 'testProjectID';

describe('init', () => {
  const mockMetadata: Metadata = {
    name: 'sdk-dapp-liquidity',
    description: 'sdk-dapp-liquidity example',
    url: 'https://example.com',
    icons: ['https://avatars.githubusercontent.com/u/179229932']
  };
  const mockNetwork: AppKitNetwork = mainnet;
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
        debug: true
      },
      acceptedChainIDs: [1],
      apiURL: 'https://localhost:3000',
      bridgeURL: 'https://devnet-bridge.example.com',
      mvxApiURL: 'https://devnet-api.multiversx.com',
      mvxExplorerAddress: 'https://devnet-explorer.multiversx.com',
      mvxChainId: '44'
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
      networks: [mockNetwork],
      projectId: projectID,
      metadata: mockMetadata,
      debug: true
    });
    expect(result).toHaveProperty('config');
    expect(result).toHaveProperty('appKit');
  });

  it('sets ssr to true if not provided in adapterConfig', () => {
    const options: InitOptions = {
      adapterConfig: {},
      appKitOptions: {
        projectId: projectID,
        metadata: mockMetadata
      },
      acceptedChainIDs: [1],
      apiURL: 'https://localhost:3000',
      bridgeURL: 'https://devnet-bridge.example.com',
      mvxApiURL: 'https://devnet-api.multiversx.com',
      mvxExplorerAddress: 'https://devnet-explorer.multiversx.com',
      mvxChainId: '44'
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
        debug: false
      },
      acceptedChainIDs: [1],
      apiURL: 'https://localhost:3000',
      bridgeURL: 'https://devnet-bridge.example.com',
      mvxApiURL: 'https://devnet-api.multiversx.com',
      mvxExplorerAddress: 'https://devnet-explorer.multiversx.com',
      mvxChainId: '44'
    };

    init(options);

    expect(WagmiAdapter).toHaveBeenCalledWith({
      projectId: projectID,
      networks: [mockNetwork],
      ssr: true
    });
  });
});
