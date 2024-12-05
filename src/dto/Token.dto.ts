export interface TokenDTO {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  crosschain: boolean;
  logoURI: string;
}
