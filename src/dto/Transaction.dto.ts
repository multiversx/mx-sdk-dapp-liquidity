export interface TransactionDTO {
  sourceChain: string;
  destinationChain: string;
  tokenSource: string;
  tokenDestination: string;
  amountSource: string;
  amountDestination: string;
  depositTimestamp: number;
  executionTimestamp: number;
  sender: string;
  status: string;
  nonce: number;
  receiver: string;
  batchId: number;
  depositTxHash: string;
  version: string;
  executeTxHash: string;
}
