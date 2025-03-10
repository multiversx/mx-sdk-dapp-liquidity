import { ProviderType } from './providerType';

export interface RateRequestBody {
  tokenIn: string;
  amountIn: string;
  fromChainId: string;
  tokenOut: string;
  toChainId: string;
}

export interface RateRequestResponse {
  fee: string;
  amountOut: string;
  provider: ProviderType;
  orderId: string;
  expiresAt?: number;
}
