import { ChainType } from '../types/chainType';

export interface ChainDTO {
  chainId: string;
  chainName: string;
  pngUrl: string;
  svgUrl: string;
  chainType: ChainType;
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
