export interface TokenDTO {
  chainId: number;
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
}
