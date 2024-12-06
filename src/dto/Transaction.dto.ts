export interface TransactionDTO {
  transactionId: string;
  userWalletAddress: string;
  providerId: string;
  fromChain: string;
  toChain: string;
  fromToken: string;
  toToken: string;
  fromAmount: number;
  toAmount: number;
  fee: number;
  status: string;
  transactionHash: string;
  timestamp: string;
  transactionDetails: string;
}
