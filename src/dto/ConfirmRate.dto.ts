import { RateRequestResponse } from '../types';

export interface ConfirmRateDto extends RateRequestResponse {
  tokenIn: string;
  amountIn: string;
  fromChainId: string;
  tokenOut: string;
  toChainId: string;
  sender: string;
  receiver: string;
}
