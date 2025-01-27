import { ChainNameType } from '../reactjs/types/chains';

export interface ChainDTO {
  chainId: number;
  chainName: ChainNameType;
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
