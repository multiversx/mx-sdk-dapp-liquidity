export interface ChainDTO {
  chainId: number;
  chainName: string;
  chainType: string;
  rpc: string;
  networkName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
    icon: string;
  };
  blockExplorerUrls: string[];
}
