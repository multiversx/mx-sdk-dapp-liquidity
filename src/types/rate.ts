export interface RateRequestBody {
  tokenIn: string;
  amountIn: string;
  fromChain: string;
  tokenOut: string;
  toChain: string;
}

export interface RateRequestResponse {
  fee: string;
  amountOut: string;
}
