export interface ConfirmRateDto {
  tokenIn: string;
  amountIn: string;
  fromChainId: string;
  tokenOut: string;
  toChainId: string;
  fee: string;
  amountOut: string;
  sender: string;
  receiver: string;
}
