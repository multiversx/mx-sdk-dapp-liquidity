import type { CaipNetwork, ChainNamespace } from '@reown/appkit-common';
import {
  AdapterBlueprint,
  WalletConnectConnector,
  WcHelpersUtil
} from '@reown/appkit-controllers';
import type { ChainAdapterConnector } from '@reown/appkit-controllers';
import UniversalProvider from '@walletconnect/universal-provider';

const WC_ID = 'walletConnect';

/** Fallback when ChainController has not populated requestedCaipNetworks for `sui` yet */
const DEFAULT_SUI_CAIP_CHAINS = ['sui:mainnet', 'sui:testnet', 'sui:devnet'];

export type SuiAdapterOptions = {
  /**
   * CAIP-2 chain ids from `init()` (e.g. `['sui:mainnet']`).
   * AppKit sometimes passes an empty `networks` array into `construct`; this keeps WC valid.
   */
  explicitCaipChains?: string[];
};

export class SuiAdapter extends AdapterBlueprint {
  /**
   * AppKit’s single WalletConnect UniversalProvider (same instance as Wagmi/EVM).
   * @see @reown/appkit-adapter-solana — adapters must NOT call UniversalProvider.init() again
   *   (duplicate Core breaks pairing / QR). `listenWalletConnect` attaches `display_uri` here only.
   */
  private sharedWcProvider?: UniversalProvider;

  private readonly explicitCaipChainsFromInit: string[];

  constructor(opts?: SuiAdapterOptions) {
    super({
      namespace: 'sui' as ChainNamespace,
      adapterType: 'sui'
    });
    this.explicitCaipChainsFromInit = opts?.explicitCaipChains ?? [];
  }

  /**
   * AppKit passes `networks` here from `createAppKit({ networks })` filtered by namespace.
   * `ChainController.getRequestedCaipNetworks('sui')` is often still empty → we must keep this.
   */
  private suiNetworksFromConfig: CaipNetwork[] = [];

  construct(params: AdapterBlueprint.Params): void {
    super.construct(params);
    this.suiNetworksFromConfig = params.networks ?? [];
  }

  /**
   * Resolves CAIP-2 chain ids for the WC session. Never return [] (breaks pairing + QR UI).
   */
  private pickChainsFromExplicit(
    explicit: string[],
    chainId?: string | number
  ): string[] {
    if (explicit.length === 0) {
      return DEFAULT_SUI_CAIP_CHAINS;
    }
    if (chainId !== undefined && chainId !== null) {
      const cid = chainId.toString();
      const match = explicit.find(
        (c) => c === `sui:${cid}` || c.endsWith(`:${cid}`)
      );
      if (match) {
        return [match];
      }
    }
    return explicit;
  }

  private resolveSuiChainsForConnect(chainId?: string | number): string[] {
    const fromController = this.getCaipNetworks('sui' as ChainNamespace);
    const source =
      fromController.length > 0 ? fromController : this.suiNetworksFromConfig;

    if (source.length === 0) {
      return this.pickChainsFromExplicit(
        this.explicitCaipChainsFromInit,
        chainId
      );
    }

    const toCaip = (n: CaipNetwork) => n.caipNetworkId || `sui:${n.id}`;

    if (chainId !== undefined && chainId !== null) {
      const match = source.find((n) => n.id?.toString() === chainId.toString());
      if (match) {
        return [toCaip(match)];
      }
    }

    return source.map(toCaip);
  }

  /**
   * `WalletConnectConnector` typings require `caipNetworks` (ChainController may still be empty
   * when this runs). Prefer networks from `construct`, else explicit/init CAIP ids.
   */
  private getCaipNetworksForWalletConnectConnector(): CaipNetwork[] {
    if (this.suiNetworksFromConfig.length > 0) {
      return this.suiNetworksFromConfig;
    }
    const caipIds =
      this.explicitCaipChainsFromInit.length > 0
        ? this.explicitCaipChainsFromInit
        : DEFAULT_SUI_CAIP_CHAINS;
    return caipIds.map((caip) => {
      const id = caip.startsWith('sui:') ? caip.slice(4) : caip;
      return {
        id,
        chainNamespace: 'sui',
        caipNetworkId: caip,
        name: 'Sui',
        nativeCurrency: { name: 'SUI', symbol: 'SUI', decimals: 9 },
        rpcUrls: {
          default: { http: [`https://fullnode.${id}.sui.io:443`] }
        }
      } as CaipNetwork;
    });
  }

  syncConnectors(): void {
    // Sui only supports WalletConnect – no injected wallets to discover
  }

  async setUniversalProvider(sharedProvider: UniversalProvider): Promise<void> {
    this.sharedWcProvider = sharedProvider;

    const wcConnector = new WalletConnectConnector({
      provider: sharedProvider,
      namespace: 'sui' as ChainNamespace,
      caipNetworks: this.getCaipNetworksForWalletConnectConnector()
    });

    this.addConnector(wcConnector as unknown as ChainAdapterConnector);

    WcHelpersUtil.listenWcProvider({
      universalProvider: sharedProvider,
      namespace: 'sui' as ChainNamespace,
      onConnect: (accounts) => this.onConnect(accounts, WC_ID),
      onDisconnect: () => this.onDisconnect(WC_ID),
      onAccountsChanged: (accounts) =>
        this.onAccountsChanged(accounts, WC_ID, false)
    });
  }

  private getWcProvider(): UniversalProvider {
    if (!this.sharedWcProvider) {
      throw new Error(
        'SuiAdapter: UniversalProvider not ready — setUniversalProvider must run before connect'
      );
    }
    return this.sharedWcProvider;
  }

  async connectWalletConnect(
    chainId?: string | number
  ): Promise<{ clientId: string } | undefined> {
    const wc = this.getWcProvider();

    if (wc.session?.namespaces?.['sui']) {
      const clientId = await wc.client.core.crypto.getClientId();
      return { clientId };
    }

    const chains = this.resolveSuiChainsForConnect(chainId);
    const safeChains = chains.length > 0 ? chains : DEFAULT_SUI_CAIP_CHAINS;

    /**
     * Same pattern as @reown/appkit-controllers WalletConnectConnector.connectWalletConnect:
     * `provider.connect({ optionalNamespaces })` — not a second UniversalProvider instance.
     * @see https://docs.walletconnect.com/ (Universal Provider — display_uri on this provider)
     */
    await wc.connect({
      optionalNamespaces: {
        sui: {
          methods: [
            'sui_signPersonalMessage',
            'sui_signTransaction',
            'sui_signAndExecuteTransaction'
          ],
          chains: safeChains,
          events: []
        }
      }
    });

    const clientId = await wc.client.core.crypto.getClientId();
    return { clientId };
  }

  async connect(
    params: AdapterBlueprint.ConnectParams
  ): Promise<AdapterBlueprint.ConnectResult> {
    const connector = this.connectors.find((c) => c.id === params.id);
    if (!connector) {
      throw new Error('Sui connector not found');
    }

    const existingConnection = this.getConnection({
      address: params.address,
      connectorId: connector.id,
      connections: this.connections,
      connectors: this.connectors
    });

    if (existingConnection?.account) {
      const chainId =
        existingConnection.caipNetwork?.id ?? params.chainId ?? 'mainnet';
      this.emit('accountChanged', {
        address: existingConnection.account.address,
        chainId,
        connector
      });
      return {
        id: connector.id,
        address: existingConnection.account.address,
        chainId,
        provider: connector.provider,
        type: connector.type
      };
    }

    const wc = this.getWcProvider();
    const accounts = WcHelpersUtil.getWalletConnectAccounts(
      wc,
      'sui' as ChainNamespace
    );
    const address = accounts[0]?.address;
    if (!address) {
      throw new Error('No Sui account found after WalletConnect session');
    }

    const caipNetwork = this.getCaipNetworks()?.find(
      (n) => n.id === params.chainId
    );

    this.addConnection({
      connectorId: connector.id,
      accounts: [{ address }],
      caipNetwork
    });

    const chainId = params.chainId ?? caipNetwork?.id ?? 'mainnet';

    this.emit('accountChanged', {
      address,
      chainId,
      connector
    });

    return {
      id: connector.id,
      address,
      chainId,
      provider: connector.provider,
      type: connector.type
    };
  }

  async disconnect(
    params: AdapterBlueprint.DisconnectParams
  ): Promise<AdapterBlueprint.DisconnectResult> {
    if (params?.id) {
      if (this.sharedWcProvider) {
        try {
          await this.sharedWcProvider.disconnect();
        } catch {
          // ignore if no active session
        }
      }
      this.deleteConnection(params.id);
    }

    if (this.connections.length === 0) {
      this.emit('disconnect');
    } else {
      this.emitFirstAvailableConnection();
    }

    return { connections: this.connections };
  }

  async getAccounts(
    params: AdapterBlueprint.GetAccountsParams
  ): Promise<AdapterBlueprint.GetAccountsResult> {
    void params;
    if (!this.sharedWcProvider) {
      return { accounts: [] };
    }
    const accounts = WcHelpersUtil.getWalletConnectAccounts(
      this.sharedWcProvider,
      'sui' as ChainNamespace
    );
    return {
      accounts: accounts.map((a) => ({
        namespace: 'sui' as const,
        address: a.address,
        type: 'eoa' as const
      }))
    };
  }

  async getBalance(
    params: AdapterBlueprint.GetBalanceParams
  ): Promise<AdapterBlueprint.GetBalanceResult> {
    if (!params.address) {
      return { balance: '0', symbol: 'SUI' };
    }
    try {
      const caipNetwork = this.getCaipNetworks()?.find(
        (n) => n.id === params.chainId
      );
      const rpcUrl = `https://fullnode.${caipNetwork?.id}.sui.io:443`;
      if (!rpcUrl) {
        return { balance: '0', symbol: 'SUI' };
      }

      const res = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'suix_getBalance',
          params: [params.address, '0x2::sui::SUI']
        })
      });
      const data = await res.json();
      const totalBalance = data?.result?.totalBalance ?? '0';
      const formatted = (parseInt(totalBalance, 10) / 1e9).toString();
      return {
        balance: formatted,
        symbol: caipNetwork?.nativeCurrency?.symbol || 'SUI'
      };
    } catch {
      return { balance: '0', symbol: 'SUI' };
    }
  }

  async switchNetwork(
    params: AdapterBlueprint.SwitchNetworkParams
  ): Promise<void> {
    await super.switchNetwork(params);
  }

  async syncConnection(
    params: AdapterBlueprint.SyncConnectionParams
  ): Promise<AdapterBlueprint.ConnectResult> {
    return this.connect({ ...params, type: '' });
  }

  async syncConnections({
    connectToFirstConnector,
    caipNetwork
  }: AdapterBlueprint.SyncConnectionsParams): Promise<void> {
    if (!this.sharedWcProvider) {
      return;
    }

    const accounts = WcHelpersUtil.getWalletConnectAccounts(
      this.sharedWcProvider,
      'sui' as ChainNamespace
    );
    if (accounts.length > 0) {
      this.addConnection({
        connectorId: WC_ID,
        accounts: accounts.map((a) => ({ address: a.address })),
        caipNetwork
      });
    }

    if (connectToFirstConnector) {
      this.emitFirstAvailableConnection();
    }
  }

  getWalletConnectProvider(
    params: AdapterBlueprint.GetWalletConnectProviderParams
  ): AdapterBlueprint.GetWalletConnectProviderResult {
    return params.provider;
  }

  async signMessage(
    params: AdapterBlueprint.SignMessageParams
  ): Promise<AdapterBlueprint.SignMessageResult> {
    const wc = this.getWcProvider();
    const result = await wc.request<{ signature: string }>(
      {
        method: 'sui_signPersonalMessage',
        params: { message: params.message, address: params.address }
      },
      'sui:mainnet'
    );
    return { signature: result.signature };
  }

  async sendTransaction(
    params: AdapterBlueprint.SendTransactionParams
  ): Promise<AdapterBlueprint.SendTransactionResult> {
    const wc = this.getWcProvider();
    const result = await wc.request<{ digest: string }>(
      {
        method: 'sui_signAndExecuteTransaction',
        params: { transaction: params.data, address: params.to }
      },
      'sui:mainnet'
    );
    return { hash: result.digest };
  }

  async estimateGas(): Promise<AdapterBlueprint.EstimateGasTransactionResult> {
    return { gas: 0n };
  }

  async writeContract(): Promise<AdapterBlueprint.WriteContractResult> {
    return { hash: '' };
  }

  parseUnits(): AdapterBlueprint.ParseUnitsResult {
    return 0n;
  }

  formatUnits(): AdapterBlueprint.FormatUnitsResult {
    return '';
  }

  async getCapabilities(): Promise<unknown> {
    return {};
  }

  async grantPermissions(): Promise<unknown> {
    return {};
  }

  async revokePermissions(): Promise<`0x${string}`> {
    return '0x';
  }

  async walletGetAssets(): Promise<AdapterBlueprint.WalletGetAssetsResponse> {
    return {};
  }
}
