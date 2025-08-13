export interface TokenDTO {
  chainId: string;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  crosschain: boolean;
  pngUrl: string;
  svgUrl: string;
  metadata: {
    minBridgeAmount: string;
    maxBridgeAmount: string;
  };
  availableTokens?: {
    address: string;
    chainId: string;
    symbol: string;
  }[];
  isNative?: boolean;
}
