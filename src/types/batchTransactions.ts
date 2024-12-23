export interface BatchTransactions {
  batchId: string;
  transactions: {
    to: string;
    data: string;
    gasLimit: string;
    value: string;
    account: string;
    hash: string;
  }[];
}
