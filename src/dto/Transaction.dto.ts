import { ProviderType } from '../types/providerType';

export interface TransactionDTO {
  fromChainId: string;
  toChainId: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountOut: string;
  depositTimestamp: number;
  sender: string;
  status: string;
  receiver: string;
  fee: string;
  txHash: string;
  provider: ProviderType;
  orderId?: string;
}
